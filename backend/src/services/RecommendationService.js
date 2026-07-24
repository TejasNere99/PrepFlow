import { Resource } from '../models/Resource.js';
import { Chapter } from '../models/Chapter.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

export class RecommendationService {
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
