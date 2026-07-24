import { ResourceProgress } from '../models/ResourceProgress.js';

export class RecentActivityService {
  /**
   * Retrieves the most recently accessed resources for a student.
   * Treats viewing as Activity, independent of Progress completion.
   * 
   * @param {string} userId 
   * @param {number} limit 
   * @returns {Promise<Array>} Array of populated resource activity objects
   */
  static async getRecentlyViewed(userId, limit = 10) {
    const recent = await ResourceProgress.find({ userId })
      .sort({ lastAccessedAt: -1 })
      .limit(limit)
      .populate({
        path: 'resourceId',
        select: 'title resourceType slug chapterId',
        populate: {
          path: 'chapterId',
          select: 'title subjectId',
          populate: {
            path: 'subjectId',
            select: 'title sheetId',
            populate: {
              path: 'sheetId',
              select: 'title slug'
            }
          }
        }
      })
      .lean();

    return recent
      .filter(p => 
        p.resourceId && 
        p.resourceId.chapterId && 
        p.resourceId.chapterId.subjectId && 
        p.resourceId.chapterId.subjectId.sheetId
      ) // ensure valid references
      .map(p => ({
        _id: p.resourceId._id,
        title: p.resourceId.title,
        type: p.resourceId.resourceType,
        slug: p.resourceId.slug,
        lastAccessedAt: p.lastAccessedAt,
        chapter: {
          _id: p.resourceId.chapterId._id,
          title: p.resourceId.chapterId.title,
        },
        subject: {
          _id: p.resourceId.chapterId.subjectId._id,
          title: p.resourceId.chapterId.subjectId.title,
        },
        sheet: {
          _id: p.resourceId.chapterId.subjectId.sheetId._id,
          title: p.resourceId.chapterId.subjectId.sheetId.title,
          slug: p.resourceId.chapterId.subjectId.sheetId.slug
        }
      }));
  }
}
