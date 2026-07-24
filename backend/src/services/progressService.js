import { ResourceProgress } from '../models/ResourceProgress.js';
import { Resource } from '../models/Resource.js';
import { Chapter } from '../models/Chapter.js';
import { Subject } from '../models/Subject.js';
import { Sheet } from '../models/Sheet.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import { evaluateAchievements } from './achievementsEngine.js';
import { generateInsights, generateNextGoal } from './insightsEngine.js';

export const upsertProgress = async (userId, resourceId, updateData) => {
  const { completed } = updateData;
  const completedAt = completed ? new Date() : null;
  const lastAccessedAt = new Date();

  const progress = await ResourceProgress.findOneAndUpdate(
    { userId, resourceId },
    { 
      ...updateData,
      ...(completed !== undefined && { completedAt }),
      lastAccessedAt 
    },
    { new: true, upsert: true }
  );

  return progress;
};

export const getSheetProgress = async (userId, sheetId) => {
  const subjects = await Subject.find({ sheetId, status: CONTENT_STATUS.ACTIVE }).lean();
  const subjectIds = subjects.map(s => s._id);

  const chapters = await Chapter.find({ subjectId: { $in: subjectIds }, status: CONTENT_STATUS.ACTIVE }).lean();
  const chapterIds = chapters.map(c => c._id);

  const resources = await Resource.find({ chapterId: { $in: chapterIds }, status: CONTENT_STATUS.ACTIVE }).lean();
  const resourceIds = resources.map(r => r._id);

  const progressRecords = await ResourceProgress.find({ 
    userId, 
    resourceId: { $in: resourceIds },
    completed: true
  }).lean();

  const completedResourceIds = new Set(progressRecords.map(p => p.resourceId.toString()));

  const chapterProgress = {};
  const subjectProgress = {};

  chapters.forEach(c => {
    chapterProgress[c._id.toString()] = { completed: 0, total: 0 };
  });
  subjects.forEach(s => {
    subjectProgress[s._id.toString()] = { completed: 0, total: 0 };
  });

  resources.forEach(r => {
    const chapId = r.chapterId.toString();
    const chap = chapters.find(c => c._id.toString() === chapId);
    if (!chap) return;
    const subId = chap.subjectId.toString();

    const isCompleted = completedResourceIds.has(r._id.toString());

    if (chapterProgress[chapId]) chapterProgress[chapId].total += 1;
    if (subjectProgress[subId]) subjectProgress[subId].total += 1;
    
    if (isCompleted) {
      if (chapterProgress[chapId]) chapterProgress[chapId].completed += 1;
      if (subjectProgress[subId]) subjectProgress[subId].completed += 1;
    }
  });

  for (const key in chapterProgress) {
    const p = chapterProgress[key];
    p.percentage = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
  }
  for (const key in subjectProgress) {
    const p = subjectProgress[key];
    p.percentage = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
  }

  const sheetTotal = resources.length;
  const sheetCompleted = completedResourceIds.size;
  const sheetPercentage = sheetTotal > 0 ? Math.round((sheetCompleted / sheetTotal) * 100) : 0;

  return {
    sheetProgress: { completed: sheetCompleted, total: sheetTotal, percentage: sheetPercentage },
    subjectProgress,
    chapterProgress,
    completedResources: Array.from(completedResourceIds)
  };
};

export const getProgressSummary = async (userId) => {
  const lastAccessedProgress = await ResourceProgress.findOne({ userId })
    .sort({ lastAccessedAt: -1 })
    .populate({
      path: 'resourceId',
      populate: {
        path: 'chapterId',
        populate: {
          path: 'subjectId',
          populate: {
            path: 'sheetId'
          }
        }
      }
    });

  let continueLearning = null;
  let lastAccessedSheetId = null;
  if (lastAccessedProgress && lastAccessedProgress.resourceId) {
    const resource = lastAccessedProgress.resourceId;
    const chapter = resource.chapterId;
    const subject = chapter?.subjectId;
    const sheet = subject?.sheetId;
    if (sheet) {
      lastAccessedSheetId = sheet._id.toString();
      continueLearning = {
        sheet: { id: sheet._id, title: sheet.title, slug: sheet.slug },
        chapter: { id: chapter._id, title: chapter.title },
        resource: { id: resource._id, title: resource.title, slug: resource.slug }
      };
    }
  }

  const allSheets = await Sheet.find({ status: CONTENT_STATUS.ACTIVE }).lean();
  const allSubjects = await Subject.find({ sheetId: { $in: allSheets.map(s => s._id) }, status: CONTENT_STATUS.ACTIVE }).lean();
  const allChapters = await Chapter.find({ subjectId: { $in: allSubjects.map(s => s._id) }, status: CONTENT_STATUS.ACTIVE }).lean();
  const allResources = await Resource.find({ chapterId: { $in: allChapters.map(s => s._id) }, status: CONTENT_STATUS.ACTIVE }).lean();

  const allProgress = await ResourceProgress.find({ userId, completed: true }).lean();
  
  const sheetProgress = {};
  allSheets.forEach(s => {
    sheetProgress[s._id.toString()] = { id: s._id, title: s.title, slug: s.slug, completed: 0, total: 0 };
  });

  allResources.forEach(r => {
    const chap = allChapters.find(c => c._id.toString() === r.chapterId.toString());
    if (!chap) return;
    const sub = allSubjects.find(s => s._id.toString() === chap.subjectId.toString());
    if (!sub) return;
    const sheetId = sub.sheetId.toString();

    if (sheetProgress[sheetId]) {
      sheetProgress[sheetId].total += 1;
      const isCompleted = allProgress.some(p => p.resourceId.toString() === r._id.toString());
      if (isCompleted) {
        sheetProgress[sheetId].completed += 1;
      }
    }
  });

  let overallTotal = 0;
  let overallCompleted = 0;

  for (const key in sheetProgress) {
    const p = sheetProgress[key];
    p.percentage = p.total > 0 ? Math.round((p.completed / p.total) * 100) : 0;
    overallTotal += p.total;
    overallCompleted += p.completed;
  }

  const overallPercentage = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0;

  // Streak & Weekly Activity Calculation
  const allAccessed = await ResourceProgress.find({ userId }).sort({ lastAccessedAt: 1 }).lean();
  
  const weeklyActivity = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
  const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  const day = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1));

  let completedThisWeek = 0;
  
  const uniqueStudyDays = new Set();
  
  allAccessed.forEach(p => {
    if (p.lastAccessedAt) {
      const accessedDate = new Date(p.lastAccessedAt);
      uniqueStudyDays.add(accessedDate.toISOString().split('T')[0]);
    }
  });

  allProgress.forEach(p => {
    if (p.completedAt) {
      const completedDate = new Date(p.completedAt);
      if (completedDate >= startOfWeek) {
        const dayName = daysMap[completedDate.getDay()];
        if (weeklyActivity[dayName] !== undefined) {
          weeklyActivity[dayName] += 1;
          completedThisWeek += 1;
        }
      }
    }
  });

  // Calculate Streak
  const sortedDays = Array.from(uniqueStudyDays).sort().reverse();
  let currentStreak = 0;
  let longestStreak = 0;
  let currentRun = 0;
  let lastStudyDate = sortedDays.length > 0 ? sortedDays[0] : null;

  const todayStr = now.toISOString().split('T')[0];
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  let streakActive = false;
  if (sortedDays.includes(todayStr) || sortedDays.includes(yesterdayStr)) {
    streakActive = true;
  }

  for (let i = 0; i < sortedDays.length; i++) {
    if (i === 0) {
      currentRun = 1;
    } else {
      const d1 = new Date(sortedDays[i - 1]);
      const d2 = new Date(sortedDays[i]);
      const diffTime = Math.abs(d1 - d2);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentRun += 1;
      } else {
        currentRun = 1;
      }
    }
    
    if (streakActive && i < currentRun) {
      currentStreak = currentRun;
    }
    if (currentRun > longestStreak) {
      longestStreak = currentRun;
    }
  }

  const engineStats = {
    overallCompleted,
    overallTotal,
    overallPercentage,
    completedThisWeek,
    sheetsProgress: Object.values(sheetProgress),
    lastAccessedSheetId
  };

  const insights = generateInsights(engineStats);
  const achievements = evaluateAchievements(engineStats);
  const nextGoal = generateNextGoal(engineStats);

  return {
    continueLearning,
    overallProgress: {
      completed: overallCompleted,
      total: overallTotal,
      percentage: overallPercentage
    },
    sheetsProgress: Object.values(sheetProgress),
    completedResources: allProgress.map(p => p.resourceId),
    weeklyActivity,
    streak: {
      currentStreak,
      longestStreak,
      lastStudyDate
    },
    insights,
    achievements,
    nextGoal
  };
};
