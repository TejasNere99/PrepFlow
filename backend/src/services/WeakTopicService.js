import { ResourceProgress } from '../models/ResourceProgress.js';
import { Resource } from '../models/Resource.js';
import { Chapter } from '../models/Chapter.js';
import { Subject } from '../models/Subject.js';
import { RevisionSchedule, REVISION_STATUS } from '../models/RevisionSchedule.js';
import { getPriorityFromScore } from '../constants/learningConstants.js';
import mongoose from 'mongoose';

class WeakTopicService {
  /**
   * Identifies weak topics for a user and returns an array of chapters with a weakness score.
   */
  static async getWeakTopics(userId) {
    // 1. Get all resources the user has interacted with
    const progressList = await ResourceProgress.find({ userId }).populate('resourceId').lean();

    // 2. Group by chapter
    const chapterStats = {};

    progressList.forEach(prog => {
      if (!prog.resourceId) return;
      const chapterId = prog.resourceId.chapterId.toString();
      
      if (!chapterStats[chapterId]) {
        chapterStats[chapterId] = {
          chapterId,
          totalInteracted: 0,
          completed: 0,
          lastActivity: prog.lastAccessedAt || prog.updatedAt,
        };
      }

      chapterStats[chapterId].totalInteracted += 1;
      if (prog.completed) {
        chapterStats[chapterId].completed += 1;
      }
      
      // Update last activity
      const activityDate = new Date(prog.lastAccessedAt || prog.updatedAt);
      if (activityDate > new Date(chapterStats[chapterId].lastActivity)) {
        chapterStats[chapterId].lastActivity = activityDate;
      }
    });

    // We also need total resources per chapter to calculate actual completion percentage.
    // Fetch chapter details and subject names
    const chapterIds = Object.keys(chapterStats);
    if (chapterIds.length === 0) return [];

    const chapters = await Chapter.find({ _id: { $in: chapterIds } })
      .populate({ 
        path: 'subjectId',
        populate: { path: 'sheetId' } 
      })
      .lean();
    
    // We need the total active resources for each chapter
    const resourceCounts = await Resource.aggregate([
      { $match: { chapterId: { $in: chapters.map(c => c._id) }, status: 'ACTIVE' } },
      { $group: { _id: '$chapterId', total: { $sum: 1 } } }
    ]);
    const resourceCountMap = {};
    resourceCounts.forEach(rc => {
      resourceCountMap[rc._id.toString()] = rc.total;
    });

    // We need pending/missed revisions for these chapters
    const revisions = await RevisionSchedule.find({
      userId,
      status: { $in: [REVISION_STATUS.MISSED, REVISION_STATUS.UPCOMING] }
    }).populate('resourceId').lean();

    const missedRevisionsMap = {}; // chapterId -> missed count
    const upcomingRevisionsMap = {}; // chapterId -> upcoming count

    revisions.forEach(rev => {
      if (!rev.resourceId) return;
      const cId = rev.resourceId.chapterId.toString();
      
      if (rev.status === REVISION_STATUS.MISSED || (rev.status === REVISION_STATUS.UPCOMING && new Date(rev.date) < new Date())) {
        missedRevisionsMap[cId] = (missedRevisionsMap[cId] || 0) + 1;
      } else {
        upcomingRevisionsMap[cId] = (upcomingRevisionsMap[cId] || 0) + 1;
      }
    });

    // 3. Calculate weakness score
    const weakTopics = [];

    chapters.forEach(chapter => {
      const cId = chapter._id.toString();
      const stats = chapterStats[cId];
      const totalResources = resourceCountMap[cId] || 0;
      
      if (totalResources === 0) return; // Skip empty chapters

      const completionPercentage = Math.round((stats.completed / totalResources) * 100);
      const pendingResources = totalResources - stats.completed;
      
      // Calculate Days Since Last Activity
      const daysSinceLastActivity = Math.floor((new Date() - new Date(stats.lastActivity)) / (1000 * 60 * 60 * 24));
      const missedRevCount = missedRevisionsMap[cId] || 0;

      // --- WEAKNESS SCORE CALCULATION (0 - 100) ---
      let weaknessScore = 0;

      // 1. Completion Factor (Weight: 40)
      // High weakness if completion is between 10% and 90%. 
      // If 100%, weakness is 0 from this factor.
      if (completionPercentage < 100) {
        weaknessScore += ((100 - completionPercentage) / 100) * 40;
      }

      // 2. Staleness Factor (Weight: 30)
      // The longer it's been since last activity, the higher the weakness. Maxes out at 30 days.
      if (completionPercentage < 100) {
        const staleness = Math.min(daysSinceLastActivity, 30);
        weaknessScore += (staleness / 30) * 30;
      }

      // 3. Revision Backlog Factor (Weight: 30)
      if (missedRevCount > 0) {
        const backlogFactor = Math.min(missedRevCount * 10, 30); // 10 points per missed revision, up to 30
        weaknessScore += backlogFactor;
      }

      // Final score capped at 100
      weaknessScore = Math.min(Math.round(weaknessScore), 100);

      // Only include topics that have some weakness (e.g., score > 20)
      if (weaknessScore > 20) {
        weakTopics.push({
          chapterId: cId,
          chapterTitle: chapter.title,
          subjectName: chapter.subjectId?.title || 'Unknown Subject',
          sheetSlug: chapter.subjectId?.sheetId?.slug || null,
          weaknessScore,
          priority: getPriorityFromScore(weaknessScore),
          completionPercentage,
          pendingResources,
          lastActivity: stats.lastActivity,
        });
      }
    });

    // Sort by weakness score descending
    weakTopics.sort((a, b) => b.weaknessScore - a.weaknessScore);

    return weakTopics;
  }
}

export default WeakTopicService;
