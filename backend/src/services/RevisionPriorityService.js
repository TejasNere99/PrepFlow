import { RevisionSchedule, REVISION_STATUS } from '../models/RevisionSchedule.js';
import { getPriorityFromScore } from '../constants/learningConstants.js';
import mongoose from 'mongoose';

class RevisionPriorityService {
  /**
   * Retrieves revision priorities for a user.
   */
  static async getRevisionPriorities(userId) {
    // 1. Fetch upcoming and missed revisions
    const revisions = await RevisionSchedule.find({
      userId,
      status: { $in: [REVISION_STATUS.MISSED, REVISION_STATUS.UPCOMING] }
    })
    .populate({
      path: 'resourceId',
      populate: { path: 'chapterId' }
    })
    .lean();

    const priorities = [];
    const now = new Date();

    revisions.forEach(rev => {
      if (!rev.resourceId || !rev.resourceId.chapterId) return;

      const dueDate = new Date(rev.date);
      const daysDiff = (now - dueDate) / (1000 * 60 * 60 * 24); // Positive = overdue, Negative = upcoming
      
      let priorityScore = 0;

      if (daysDiff > 0) {
        // Overdue: Score scales from 50 up to 100 max over 14 days
        priorityScore = 50 + Math.min((daysDiff / 14) * 50, 50);
      } else {
        // Upcoming: Score scales from 0 up to 49 as the due date approaches (max within 7 days)
        const daysUntilDue = Math.abs(daysDiff);
        if (daysUntilDue <= 7) {
          priorityScore = 49 - ((daysUntilDue / 7) * 49);
        } else {
          priorityScore = 0; // Far in the future
        }
      }

      priorityScore = Math.min(Math.max(Math.round(priorityScore), 0), 100);

      // We only care about priorities that are somewhat pressing, e.g., > 10 score
      if (priorityScore > 10) {
        priorities.push({
          id: rev._id.toString(),
          priorityScore,
          priority: getPriorityFromScore(priorityScore),
          dueDate: rev.date,
          resource: {
            id: rev.resourceId._id.toString(),
            title: rev.resourceId.title,
            slug: rev.resourceId.slug,
          },
          chapter: {
            id: rev.resourceId.chapterId._id.toString(),
            title: rev.resourceId.chapterId.title,
          }
        });
      }
    });

    // Sort by priorityScore descending
    priorities.sort((a, b) => b.priorityScore - a.priorityScore);

    return priorities;
  }
}

export default RevisionPriorityService;
