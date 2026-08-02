import { ResourceProgress } from '../models/ResourceProgress.js';
import { INSIGHT_TYPES, getPriorityFromScore } from '../constants/learningConstants.js';
import mongoose from 'mongoose';

class LearningInsightsService {
  static async getInsights(userId) {
    const insights = [];
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Fetch progress from last 7 days
    const recentProgress = await ResourceProgress.find({
      userId,
      $or: [
        { completedAt: { $gte: sevenDaysAgo } },
        { lastAccessedAt: { $gte: sevenDaysAgo } }
      ]
    }).populate({
      path: 'resourceId',
      populate: {
        path: 'chapterId',
        populate: {
          path: 'subjectId'
        }
      }
    }).lean();

    let totalCompleted = 0;
    const subjectStats = {};

    recentProgress.forEach(prog => {
      if (!prog.resourceId || !prog.resourceId.chapterId || !prog.resourceId.chapterId.subjectId) return;
      const subjectName = prog.resourceId.chapterId.subjectId.title;
      
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = 0;
      }

      if (prog.completed && prog.completedAt >= sevenDaysAgo) {
        subjectStats[subjectName] += 1;
        totalCompleted += 1;
      }
    });

    // 1. Progress Insight
    if (totalCompleted > 0) {
      let topSubject = null;
      let topCount = 0;

      for (const [sub, count] of Object.entries(subjectStats)) {
        if (count > topCount) {
          topSubject = sub;
          topCount = count;
        }
      }

      let importanceScore = Math.min(totalCompleted * 10, 100);

      if (topSubject) {
        insights.push({
          type: INSIGHT_TYPES.PROGRESS,
          title: `${topSubject} Improved`,
          description: `You completed ${topCount} ${topSubject} resources this week.`,
          importanceScore,
          priority: getPriorityFromScore(importanceScore),
        });
      }
    }

    // 2. Consistency Insight (Example logic: user accessed on multiple distinct days)
    const distinctDays = new Set();
    recentProgress.forEach(prog => {
      const dateStr = new Date(prog.lastAccessedAt || prog.updatedAt).toISOString().split('T')[0];
      distinctDays.add(dateStr);
    });

    if (distinctDays.size >= 4) {
      let importanceScore = Math.min(distinctDays.size * 15, 100);
      insights.push({
        type: INSIGHT_TYPES.CONSISTENCY,
        title: `Consistent Study Habit`,
        description: `You studied on ${distinctDays.size} different days this week. Keep it up!`,
        importanceScore,
        priority: getPriorityFromScore(importanceScore),
      });
    }

    // Sort descending by importanceScore
    insights.sort((a, b) => b.importanceScore - a.importanceScore);

    return insights;
  }
}

export default LearningInsightsService;
