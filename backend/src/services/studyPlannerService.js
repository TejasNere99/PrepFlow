import mongoose from 'mongoose';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import {
  getPriorityFromScore,
  LEARNING_STAGES,
} from '../constants/learningConstants.js';
import {
  PLAN_REASON_TYPES,
  PLAN_TASK_STATUS,
  PLAN_TYPES,
  PLANNER_DEFAULTS,
} from '../constants/plannerConstants.js';
import { ApiError } from '../utils/ApiError.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { ResourceProgress } from '../models/ResourceProgress.js';
import { RevisionSchedule } from '../models/RevisionSchedule.js';
import { StudyPlan } from '../models/StudyPlan.js';
import { Subject } from '../models/Subject.js';
import LearningInsightsService from './LearningInsightsService.js';
import { RecommendationService } from './RecommendationService.js';
import RevisionPriorityService from './RevisionPriorityService.js';
import WeakTopicService from './WeakTopicService.js';

const startOfDay = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const startOfWeek = (value = new Date()) => {
  const date = startOfDay(value);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date;
};

const normalizeSettings = (settings = {}) => {
  const dailyStudyMinutes = Number(settings.dailyStudyMinutes || settings.availableMinutes || PLANNER_DEFAULTS.dailyStudyMinutes);

  return {
    dailyStudyMinutes: Math.max(1, Math.floor(dailyStudyMinutes)),
    preferredStudyDays: Array.isArray(settings.preferredStudyDays) && settings.preferredStudyDays.length > 0
      ? settings.preferredStudyDays.map(Number).filter((day) => day >= 0 && day <= 6)
      : [...PLANNER_DEFAULTS.preferredStudyDays],
    preferredSubjects: Array.isArray(settings.preferredSubjects)
      ? settings.preferredSubjects.map((subject) => String(subject).trim()).filter(Boolean)
      : [],
    preferredStudyTime: settings.preferredStudyTime ? String(settings.preferredStudyTime).trim() : '',
  };
};

const getResourceStageRank = (resourceType) => RecommendationService._getStageRank(resourceType);

const getResourceStageName = (resourceType) => {
  const rank = getResourceStageRank(resourceType);
  const stage = Object.entries(LEARNING_STAGES).find(([, value]) => value === rank);
  return stage ? stage[0] : 'RESOURCE';
};

const getEstimatedMinutes = (resource) => {
  const metadata = resource.metadata || {};
  const candidates = [
    metadata.estimatedMinutes,
    metadata.durationMinutes,
    metadata.estimatedDurationMinutes,
    metadata.minutes,
  ];

  for (const candidate of candidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value > 0) {
      return Math.ceil(value);
    }
  }

  const hourCandidates = [metadata.estimatedHours, metadata.durationHours];
  for (const candidate of hourCandidates) {
    const value = Number(candidate);
    if (Number.isFinite(value) && value > 0) {
      return Math.ceil(value * 60);
    }
  }

  return PLANNER_DEFAULTS.fallbackResourceMinutes;
};

const getResumeUrl = (resource) => `/resources/${resource.slug}`;

const mapResourceDto = (resource) => ({
  id: resource._id.toString(),
  title: resource.title,
  slug: resource.slug,
  resourceType: resource.resourceType,
  chapter: {
    id: resource.chapterId?._id?.toString(),
    title: resource.chapterId?.title,
    slug: resource.chapterId?.slug,
  },
  subject: {
    id: resource.chapterId?.subjectId?._id?.toString(),
    title: resource.chapterId?.subjectId?.title,
    slug: resource.chapterId?.subjectId?.slug,
  },
  sheet: {
    id: resource.chapterId?.subjectId?.sheetId?._id?.toString(),
    title: resource.chapterId?.subjectId?.sheetId?.title,
    slug: resource.chapterId?.subjectId?.sheetId?.slug,
  },
});

const taskDto = (task, resource) => ({
  taskId: task.taskId,
  resourceId: task.resourceId?.toString(),
  revisionScheduleId: task.revisionScheduleId?.toString?.() || task.revisionScheduleId || null,
  title: resource?.title || 'Study Resource',
  type: resource?.resourceType || 'Resource',
  learningStage: resource ? getResourceStageName(resource.resourceType) : 'RESOURCE',
  reasonType: task.reasonType,
  reason: task.reason,
  priority: task.priority,
  score: task.score,
  scoringMetadata: task.scoringMetadata,
  estimatedMinutes: task.estimatedMinutes,
  originalEstimatedMinutes: task.originalEstimatedMinutes,
  isPartial: task.isPartial,
  scheduledDate: task.scheduledDate,
  status: task.status,
  completed: task.status === PLAN_TASK_STATUS.COMPLETED,
  resumeUrl: resource ? getResumeUrl(resource) : null,
  resource: resource ? mapResourceDto(resource) : null,
});

class StudyPlannerService {
  static async getTodayPlan(userId, settings = {}) {
    const scheduledDate = startOfDay(settings.date || new Date());
    const existingPlan = await this.#findPlan(userId, PLAN_TYPES.DAILY, scheduledDate);

    if (existingPlan) {
      return this.#hydratePlan(existingPlan);
    }

    return this.generatePlan(userId, {
      ...settings,
      planType: PLAN_TYPES.DAILY,
      persist: false,
      scheduledDate,
    });
  }

  static async getWeeklyPlan(userId, settings = {}) {
    const weekStartDate = startOfWeek(settings.date || new Date());
    const existingPlan = await StudyPlan.findOne({
      userId,
      planType: PLAN_TYPES.WEEKLY,
      weekStartDate,
    }).lean();

    if (existingPlan) {
      return this.#hydratePlan(existingPlan);
    }

    return this.generatePlan(userId, {
      ...settings,
      planType: PLAN_TYPES.WEEKLY,
      persist: false,
      weekStartDate,
    });
  }

  static async generatePlan(userId, options = {}) {
    const planType = options.planType === PLAN_TYPES.WEEKLY ? PLAN_TYPES.WEEKLY : PLAN_TYPES.DAILY;
    const settings = normalizeSettings(options);
    const scheduledDate = startOfDay(options.scheduledDate || options.date || new Date());
    const weekStartDate = planType === PLAN_TYPES.WEEKLY ? startOfWeek(options.weekStartDate || scheduledDate) : null;
    const weekEndDate = weekStartDate ? addDays(weekStartDate, 6) : null;
    const context = await this.#buildPlannerContext(userId, settings);
    const activeTaskResourceIds = await this.#getBlockedResourceIds(userId);
    const candidates = this.#buildCandidates(context, settings, activeTaskResourceIds);

    const allocation = planType === PLAN_TYPES.WEEKLY
      ? this.#allocateWeekly(candidates, settings, weekStartDate)
      : {
          days: [{
            date: scheduledDate,
            tasks: this.#allocateDaily(candidates, settings.dailyStudyMinutes, scheduledDate),
          }],
        };

    const tasks = allocation.days.flatMap((day) => day.tasks);
    const totalEstimatedMinutes = tasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
    const plan = {
      userId,
      planType,
      scheduledDate,
      weekStartDate,
      weekEndDate,
      settings,
      totalEstimatedMinutes,
      tasks,
      intelligenceSummary: {
        weakTopics: context.weakTopics.length,
        recommendations: context.recommendations.length,
        revisionPriorities: context.revisionPriorities.length,
        insights: context.insights.length,
        candidateResources: candidates.length,
      },
    };

    if (options.persist !== false) {
      const query = planType === PLAN_TYPES.WEEKLY
        ? { userId, planType, weekStartDate }
        : { userId, planType, scheduledDate };

      const saved = await StudyPlan.findOneAndUpdate(query, plan, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }).lean();

      return this.#hydratePlan(saved);
    }

    return this.#hydrateGeneratedPlan(plan, context.resourceMap);
  }

  static async regeneratePlan(userId, options = {}) {
    const planType = options.planType === PLAN_TYPES.WEEKLY ? PLAN_TYPES.WEEKLY : PLAN_TYPES.DAILY;
    const scheduledDate = startOfDay(options.scheduledDate || options.date || new Date());
    const weekStartDate = planType === PLAN_TYPES.WEEKLY ? startOfWeek(options.weekStartDate || scheduledDate) : null;
    const existingPlan = planType === PLAN_TYPES.WEEKLY
      ? await StudyPlan.findOne({ userId, planType, weekStartDate }).lean()
      : await this.#findPlan(userId, planType, scheduledDate);

    const completedTasks = existingPlan?.tasks?.filter((task) => task.status === PLAN_TASK_STATUS.COMPLETED) || [];
    const completedMinutes = completedTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);
    const requestedSettings = normalizeSettings({
      ...(existingPlan?.settings || {}),
      ...options,
    });
    const remainingMinutes = Math.max(1, requestedSettings.dailyStudyMinutes - completedMinutes);

    const regenerated = await this.generatePlan(userId, {
      ...requestedSettings,
      dailyStudyMinutes: remainingMinutes,
      planType,
      persist: false,
      scheduledDate,
      weekStartDate,
    });

    const preservedResourceIds = new Set(completedTasks.map((task) => task.resourceId.toString()));
    const newTasks = regenerated.tasks.filter((task) => !preservedResourceIds.has(task.resourceId));
    const updatedTasks = [...completedTasks, ...newTasks].map((task) => ({
      taskId: task.taskId,
      resourceId: task.resourceId,
      revisionScheduleId: task.revisionScheduleId || null,
      scheduledDate: task.scheduledDate,
      estimatedMinutes: task.estimatedMinutes,
      originalEstimatedMinutes: task.originalEstimatedMinutes || null,
      isPartial: Boolean(task.isPartial),
      status: task.status || PLAN_TASK_STATUS.UPCOMING,
      priority: task.priority,
      score: task.score,
      reasonType: task.reasonType,
      reason: task.reason,
      scoringMetadata: task.scoringMetadata,
      completedAt: task.completedAt || null,
    }));

    const query = planType === PLAN_TYPES.WEEKLY
      ? { userId, planType, weekStartDate }
      : { userId, planType, scheduledDate };

    const saved = await StudyPlan.findOneAndUpdate(query, {
      userId,
      planType,
      scheduledDate,
      weekStartDate,
      weekEndDate: weekStartDate ? addDays(weekStartDate, 6) : null,
      settings: requestedSettings,
      totalEstimatedMinutes: updatedTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0),
      tasks: updatedTasks,
    }, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }).lean();

    return this.#hydratePlan(saved);
  }

  static async updateTaskStatus(userId, taskId, status, updates = {}) {
    if (!Object.values(PLAN_TASK_STATUS).includes(status)) {
      throw new ApiError(400, 'Invalid planner task status');
    }

    const plan = await StudyPlan.findOne({
      userId,
      'tasks.taskId': taskId,
    });

    if (!plan) {
      throw new ApiError(404, 'Planner task not found');
    }

    const task = plan.tasks.find((item) => item.taskId === taskId);
    task.status = status;
    task.completedAt = status === PLAN_TASK_STATUS.COMPLETED ? new Date() : null;

    if (status === PLAN_TASK_STATUS.RESCHEDULED && updates.scheduledDate) {
      task.scheduledDate = startOfDay(updates.scheduledDate);
    }

    await plan.save();
    return this.#hydratePlan(plan.toObject());
  }

  static async #buildPlannerContext(userId, settings) {
    const [
      weakTopics,
      recommendations,
      revisionPriorities,
      insights,
      progressRecords,
    ] = await Promise.all([
      WeakTopicService.getWeakTopics(userId),
      RecommendationService.getRecommendations(userId),
      RevisionPriorityService.getRevisionPriorities(userId),
      LearningInsightsService.getInsights(userId),
      ResourceProgress.find({ userId }).lean(),
    ]);

    const preferredSubjectIds = settings.preferredSubjects.filter((subject) => mongoose.Types.ObjectId.isValid(subject));
    const preferredSubjectTitles = settings.preferredSubjects
      .filter((subject) => !mongoose.Types.ObjectId.isValid(subject))
      .map((subject) => subject.toLowerCase());

    let subjectFilterIds = preferredSubjectIds.map((subject) => new mongoose.Types.ObjectId(subject));
    if (preferredSubjectTitles.length > 0) {
      const subjects = await Subject.find({
        title: { $in: preferredSubjectTitles.map((title) => new RegExp(`^${title}$`, 'i')) },
        status: CONTENT_STATUS.ACTIVE,
      }).select('_id').lean();
      subjectFilterIds = [...subjectFilterIds, ...subjects.map((subject) => subject._id)];
    }

    const chapterQuery = { status: CONTENT_STATUS.ACTIVE };
    if (subjectFilterIds.length > 0) {
      chapterQuery.subjectId = { $in: subjectFilterIds };
    }

    const chapters = await Chapter.find(chapterQuery).select('_id').lean();
    const resources = await Resource.find({
      chapterId: { $in: chapters.map((chapter) => chapter._id) },
      status: CONTENT_STATUS.ACTIVE,
    })
      .select('title slug resourceType metadata chapterId order displayOrder tags')
      .populate({
        path: 'chapterId',
        select: 'title slug subjectId order displayOrder',
        populate: {
          path: 'subjectId',
          select: 'title slug sheetId order displayOrder',
          populate: {
            path: 'sheetId',
            select: 'title slug order displayOrder',
          },
        },
      })
      .sort({ displayOrder: 1, order: 1, title: 1 })
      .limit(PLANNER_DEFAULTS.maxCandidateResources)
      .lean();

    const resourceMap = new Map(resources.map((resource) => [resource._id.toString(), resource]));

    return {
      weakTopics,
      recommendations,
      revisionPriorities,
      insights,
      progressRecords,
      resources,
      resourceMap,
    };
  }

  static async #getBlockedResourceIds(userId) {
    const plans = await StudyPlan.find({
      userId,
      'tasks.status': { $in: [PLAN_TASK_STATUS.UPCOMING, PLAN_TASK_STATUS.IN_PROGRESS, PLAN_TASK_STATUS.COMPLETED] },
    }).select('tasks.resourceId tasks.status').lean();

    return new Set(
      plans.flatMap((plan) => plan.tasks)
        .filter((task) => [PLAN_TASK_STATUS.IN_PROGRESS, PLAN_TASK_STATUS.COMPLETED].includes(task.status))
        .map((task) => task.resourceId.toString()),
    );
  }

  static #buildCandidates(context, settings, blockedResourceIds) {
    const completedResourceIds = new Set(
      context.progressRecords
        .filter((progress) => progress.completed)
        .map((progress) => progress.resourceId.toString()),
    );
    const progressByResourceId = new Map(
      context.progressRecords.map((progress) => [progress.resourceId.toString(), progress]),
    );
    const weakTopicByChapterId = new Map(context.weakTopics.map((topic) => [topic.chapterId, topic]));
    const recommendationBySlug = new Map();
    context.recommendations.forEach((recommendation) => {
      const slug = recommendation.resumeUrl?.split('/').filter(Boolean).pop();
      if (slug) recommendationBySlug.set(slug, recommendation);
    });
    const revisionByResourceId = new Map(
      context.revisionPriorities.map((revision) => [revision.resource?.id, revision]),
    );

    return context.resources
      .filter((resource) => resource.chapterId?._id && resource.chapterId?.subjectId?._id && resource.chapterId?.subjectId?.sheetId?._id)
      .filter((resource) => !completedResourceIds.has(resource._id.toString()))
      .filter((resource) => !blockedResourceIds.has(resource._id.toString()))
      .map((resource) => {
        const resourceId = resource._id.toString();
        const chapterId = resource.chapterId?._id?.toString();
        const weakTopic = weakTopicByChapterId.get(chapterId);
        const recommendation = recommendationBySlug.get(resource.slug);
        const revision = revisionByResourceId.get(resourceId);
        const progress = progressByResourceId.get(resourceId);
        const stageRank = getResourceStageRank(resource.resourceType);
        const learningStageScore = Math.max(0, 100 - (stageRank - 1) * 12);
        const pendingResourceScore = progress ? 55 : 70;
        const stalenessScore = progress?.lastAccessedAt
          ? Math.min(100, Math.floor((new Date() - new Date(progress.lastAccessedAt)) / (1000 * 60 * 60 * 24)) * 4)
          : 45;

        const scoringMetadata = {
          weaknessScore: weakTopic?.weaknessScore || 0,
          recommendationScore: recommendation?.score || 0,
          revisionPriorityScore: revision?.priorityScore || 0,
          learningStageScore,
          pendingResourceScore,
          stalenessScore,
        };

        const score = Math.min(100, Math.round(
          scoringMetadata.weaknessScore * 0.3 +
          scoringMetadata.recommendationScore * 0.25 +
          scoringMetadata.revisionPriorityScore * 0.25 +
          scoringMetadata.learningStageScore * 0.1 +
          scoringMetadata.pendingResourceScore * 0.05 +
          scoringMetadata.stalenessScore * 0.05,
        ));

        scoringMetadata.totalScore = score;

        let reasonType = PLAN_REASON_TYPES.PENDING_RESOURCE;
        let reason = 'Pending resource in your active learning path';

        if (revision?.priorityScore >= 50) {
          reasonType = PLAN_REASON_TYPES.OVERDUE_REVISION;
          reason = `Revision priority score ${revision.priorityScore} for this resource`;
        } else if (weakTopic?.weaknessScore >= 70) {
          reasonType = PLAN_REASON_TYPES.WEAK_TOPIC;
          reason = `${weakTopic.chapterTitle} has weakness score ${weakTopic.weaknessScore}`;
        } else if (recommendation) {
          reasonType = PLAN_REASON_TYPES.SMART_RECOMMENDATION;
          reason = recommendation.reason;
        } else if (progress) {
          reasonType = PLAN_REASON_TYPES.CONTINUE_STAGE;
          reason = `Continue your ${getResourceStageName(resource.resourceType)} stage`;
        }

        return {
          resource,
          task: {
            taskId: `plan-${resourceId}`,
            resourceId,
            revisionScheduleId: revision?.id || null,
            estimatedMinutes: getEstimatedMinutes(resource),
            originalEstimatedMinutes: null,
            isPartial: false,
            status: PLAN_TASK_STATUS.UPCOMING,
            priority: getPriorityFromScore(score),
            score,
            reasonType,
            reason,
            scoringMetadata,
          },
        };
      })
      .sort((a, b) => b.task.score - a.task.score || a.resource.displayOrder - b.resource.displayOrder);
  }

  static #allocateDaily(candidates, availableMinutes, scheduledDate) {
    const tasks = [];
    let remainingMinutes = availableMinutes;

    for (const candidate of candidates) {
      if (remainingMinutes <= 0) break;

      const estimatedMinutes = candidate.task.estimatedMinutes;
      if (estimatedMinutes <= remainingMinutes) {
        tasks.push({
          ...candidate.task,
          scheduledDate,
        });
        remainingMinutes -= estimatedMinutes;
      } else if (remainingMinutes >= PLANNER_DEFAULTS.minimumSplitMinutes) {
        tasks.push({
          ...candidate.task,
          scheduledDate,
          estimatedMinutes: remainingMinutes,
          originalEstimatedMinutes: estimatedMinutes,
          isPartial: true,
          reason: `${candidate.task.reason}; split to fit available study time`,
        });
        remainingMinutes = 0;
      }
    }

    return tasks;
  }

  static #allocateWeekly(candidates, settings, weekStartDate) {
    const preferredDays = new Set(settings.preferredStudyDays);
    const days = [];
    const usedResourceIds = new Set();

    for (let offset = 0; offset < PLANNER_DEFAULTS.weeklyDays; offset += 1) {
      const date = addDays(weekStartDate, offset);
      if (!preferredDays.has(date.getDay())) {
        days.push({ date, tasks: [] });
        continue;
      }

      const dayCandidates = candidates.filter((candidate) => !usedResourceIds.has(candidate.task.resourceId.toString()));
      const tasks = this.#allocateDaily(dayCandidates, settings.dailyStudyMinutes, date);
      tasks.forEach((task) => usedResourceIds.add(task.resourceId.toString()));
      days.push({ date, tasks });
    }

    return { days };
  }

  static async #findPlan(userId, planType, scheduledDate) {
    return StudyPlan.findOne({ userId, planType, scheduledDate }).lean();
  }

  static async #hydratePlan(plan) {
    const resourceIds = plan.tasks.map((task) => task.resourceId);
    const resources = await Resource.find({ _id: { $in: resourceIds } })
      .select('title slug resourceType metadata chapterId')
      .populate({
        path: 'chapterId',
        select: 'title slug subjectId',
        populate: {
          path: 'subjectId',
          select: 'title slug sheetId',
          populate: { path: 'sheetId', select: 'title slug' },
        },
      })
      .lean();
    const resourceMap = new Map(resources.map((resource) => [resource._id.toString(), resource]));
    return this.#hydrateGeneratedPlan(plan, resourceMap);
  }

  static #hydrateGeneratedPlan(plan, resourceMap) {
    const daysByDate = new Map();
    const tasks = plan.tasks.map((task) => {
      const resource = resourceMap.get(task.resourceId.toString());
      return taskDto(task, resource);
    });

    tasks.forEach((task) => {
      const dateKey = startOfDay(task.scheduledDate).toISOString();
      if (!daysByDate.has(dateKey)) {
        daysByDate.set(dateKey, {
          date: task.scheduledDate,
          totalEstimatedMinutes: 0,
          tasks: [],
        });
      }
      const day = daysByDate.get(dateKey);
      day.tasks.push(task);
      day.totalEstimatedMinutes += task.estimatedMinutes;
    });

    return {
      id: plan._id?.toString() || null,
      planType: plan.planType,
      scheduledDate: plan.scheduledDate,
      weekStartDate: plan.weekStartDate,
      weekEndDate: plan.weekEndDate,
      settings: plan.settings,
      totalEstimatedMinutes: plan.totalEstimatedMinutes,
      progress: this.#getPlanProgress(tasks),
      days: Array.from(daysByDate.values()).sort((a, b) => new Date(a.date) - new Date(b.date)),
      tasks,
      intelligenceSummary: plan.intelligenceSummary,
    };
  }

  static #getPlanProgress(tasks) {
    const completed = tasks.filter((task) => task.status === PLAN_TASK_STATUS.COMPLETED).length;
    const total = tasks.length;
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}

export default StudyPlannerService;
