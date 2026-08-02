import { Resource } from '../models/Resource.js';
import { Chapter } from '../models/Chapter.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import { ResourceProgress } from '../models/ResourceProgress.js';
import { RevisionSchedule, REVISION_STATUS } from '../models/RevisionSchedule.js';
import { RECOMMENDATION_TYPES, getPriorityFromScore, LEARNING_STAGES } from '../constants/learningConstants.js';

export class RecommendationService {
  static _getStageRank(resourceType) {
    const type = (resourceType || '').toUpperCase();
    if (type.includes('LECTURE') || type.includes('PLAYLIST') || type.includes('VIDEO')) return LEARNING_STAGES.LECTURE;
    if (type.includes('NOTE') || type.includes('FORMULA')) return LEARNING_STAGES.NOTES;
    if (type.includes('PRACTICE')) return LEARNING_STAGES.PRACTICE;
    if (type.includes('EXERCISE')) return LEARNING_STAGES.EXERCISE;
    if (type.includes('PYQ') || type.includes('PAST YEAR')) return LEARNING_STAGES.PYQS;
    if (type.includes('CHALLENGE')) return LEARNING_STAGES.CHALLENGE;
    if (type.includes('REVISION')) return LEARNING_STAGES.REVISION;
    return 99; // Unknown fallback
  }

  static _getStageName(rank) {
    const stage = Object.entries(LEARNING_STAGES).find(([_, value]) => value === rank);
    return stage ? stage[0].charAt(0) + stage[0].slice(1).toLowerCase() : 'Next Topic';
  }

  static async getRecommendations(userId) {
    const recommendations = [];

    // 1. Find all in-progress chapters
    const progressList = await ResourceProgress.find({ userId }).populate('resourceId').lean();
    const chapterSet = new Set();
    const completedResources = new Set();

    progressList.forEach(prog => {
      if (!prog.resourceId) return;
      chapterSet.add(prog.resourceId.chapterId.toString());
      if (prog.completed) {
        completedResources.add(prog.resourceId._id.toString());
      }
    });

    const chapterIds = Array.from(chapterSet);
    const chapters = await Chapter.find({ _id: { $in: chapterIds } }).lean();

    // 2. For each chapter, determine the next logical learning stage
    for (const chapter of chapters) {
      const chapterId = chapter._id.toString();
      const resources = await Resource.find({ chapterId: chapter._id, status: 'ACTIVE' })
        .sort({ displayOrder: 1 })
        .lean();

      if (resources.length === 0) continue;

      // Group resources by stage
      const stageMap = {};
      resources.forEach(res => {
        const rank = this._getStageRank(res.resourceType);
        if (!stageMap[rank]) stageMap[rank] = { total: 0, completed: 0, uncompleted: [] };
        stageMap[rank].total += 1;
        if (completedResources.has(res._id.toString())) {
          stageMap[rank].completed += 1;
        } else {
          stageMap[rank].uncompleted.push(res);
        }
      });

      // Find the lowest rank stage that is not 100% complete
      const sortedRanks = Object.keys(stageMap).map(Number).sort((a, b) => a - b);
      let nextStageRank = null;
      let nextStageData = null;

      for (const rank of sortedRanks) {
        if (stageMap[rank].completed < stageMap[rank].total) {
          nextStageRank = rank;
          nextStageData = stageMap[rank];
          break;
        }
      }

      if (nextStageRank && nextStageData) {
        const stageName = this._getStageName(nextStageRank);
        let nextStageName = 'the next level';
        const nextRankIdx = sortedRanks.indexOf(nextStageRank) + 1;
        if (nextRankIdx < sortedRanks.length) {
          nextStageName = this._getStageName(sortedRanks[nextRankIdx]);
        }

        const remaining = nextStageData.total - nextStageData.completed;
        const firstUncompleted = nextStageData.uncompleted[0];

        // Base score calculations:
        // Prioritize lower stage ranks (Lecture is more fundamental than Practice)
        // Also prioritize if very few resources are left (momentum)
        let recommendationScore = 80 - (nextStageRank * 5); // Base 80, drops 5 per rank
        if (remaining <= 2) recommendationScore += 10; // Momentum bonus
        
        // Ensure within 0-100
        recommendationScore = Math.min(Math.max(recommendationScore, 0), 100);

        recommendations.push({
          id: `cont-stage-${chapterId}`,
          type: RECOMMENDATION_TYPES.CONTINUE_STAGE,
          title: `Continue ${chapter.title}`,
          reason: `${remaining} ${stageName} resource${remaining > 1 ? 's' : ''} remaining before ${nextStageName}`,
          priority: getPriorityFromScore(recommendationScore),
          resumeUrl: `/resources/${firstUncompleted.slug}`,
          score: recommendationScore
        });
      }
    }

    // 3. Add overdue revisions to recommendations
    const revisions = await RevisionSchedule.find({
      userId,
      status: { $in: [REVISION_STATUS.MISSED, REVISION_STATUS.UPCOMING] }
    }).populate('resourceId').lean();

    revisions.forEach(rev => {
      if (!rev.resourceId) return;
      const isOverdue = rev.status === REVISION_STATUS.MISSED || new Date(rev.date) < new Date();
      if (isOverdue) {
        const daysOverdue = Math.floor((new Date() - new Date(rev.date)) / (1000 * 60 * 60 * 24));
        let revScore = 60 + Math.min(daysOverdue * 5, 40); // Cap at 100
        
        recommendations.push({
          id: `rev-${rev._id}`,
          type: RECOMMENDATION_TYPES.REVISE_OVERDUE,
          title: `Revise ${rev.resourceId.title}`,
          reason: `Overdue by ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''}`,
          priority: getPriorityFromScore(revScore),
          resumeUrl: `/resources/${rev.resourceId.slug}`,
          score: revScore
        });
      }
    });

    // 4. Sort all recommendations by score descending
    recommendations.sort((a, b) => b.score - a.score);

    return recommendations;
  }

  /**
   * Retrieves related resources.
   * Priority: Same Chapter -> Same Subject -> Similar Tags -> Similar Type
   * 
   * @param {string} resourceId 
   * @param {number} limit 
   * @returns {Promise<Array>}
   */
  static async getRelatedResources(resourceId, limit = 5) {
    const sourceResource = await Resource.findById(resourceId).populate('chapterId').lean();
    if (!sourceResource) return [];

    const { chapterId, tags, resourceType } = sourceResource;
    
    // 1. Same Chapter
    const sameChapter = await Resource.find({
      _id: { $ne: resourceId },
      chapterId: chapterId._id,
      status: CONTENT_STATUS.ACTIVE
    })
    .select('title resourceType slug')
    .limit(limit)
    .lean();

    if (sameChapter.length >= limit) {
      return sameChapter;
    }

    // 2. Same Subject (Sibling Chapters)
    const siblingChapters = await Chapter.find({
      _id: { $ne: chapterId._id },
      subjectId: chapterId.subjectId,
      status: CONTENT_STATUS.ACTIVE
    }).select('_id').lean();

    const siblingChapterIds = siblingChapters.map(c => c._id);
    
    let sameSubject = [];
    if (siblingChapterIds.length > 0) {
      sameSubject = await Resource.find({
        _id: { $ne: resourceId },
        chapterId: { $in: siblingChapterIds },
        status: CONTENT_STATUS.ACTIVE
      })
      .select('title resourceType slug')
      .limit(limit - sameChapter.length)
      .lean();
    }

    const collectedIds = new Set([resourceId.toString(), ...sameChapter.map(r => r._id.toString()), ...sameSubject.map(r => r._id.toString())]);

    // 3. Similar Tags
    let sameTags = [];
    if (tags && tags.length > 0 && collectedIds.size < limit + 1) {
      sameTags = await Resource.find({
        _id: { $nin: Array.from(collectedIds) },
        tags: { $in: tags },
        status: CONTENT_STATUS.ACTIVE
      })
      .select('title resourceType slug')
      .limit(limit - (sameChapter.length + sameSubject.length))
      .lean();
    }

    return [...sameChapter, ...sameSubject, ...sameTags].map(r => ({ ...r, type: r.resourceType }));
  }
}
