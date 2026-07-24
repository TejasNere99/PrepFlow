import { Sheet } from '../models/Sheet.js';
import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

export class SearchService {
  /**
   * Executes a universal search across all learning hierarchies.
   * Internal implementation can be swapped with Atlas Search later.
   * 
   * @param {string} query The search string
   * @returns {Promise<Object>} Categorized search results
   */
  static async globalSearch(query) {
    if (!query || query.trim().length === 0) {
      return { sheets: [], subjects: [], chapters: [], resources: [] };
    }

    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape regex
    const regexOptions = { $regex: safeQuery, $options: 'i' };

    const commonFilter = { status: CONTENT_STATUS.ACTIVE };

    // Parallel fetch
    const [sheets, subjects, chapters, resources] = await Promise.all([
      Sheet.find({ ...commonFilter, $or: [{ title: regexOptions }, { tags: regexOptions }] })
        .select('title slug description tags status')
        .limit(20)
        .lean(),
      Subject.find({ ...commonFilter, $or: [{ title: regexOptions }] })
        .select('title sheetId status')
        .limit(20)
        .lean(),
      Chapter.find({ ...commonFilter, $or: [{ title: regexOptions }] })
        .select('title subjectId status')
        .limit(20)
        .lean(),
      Resource.find({ ...commonFilter, $or: [{ title: regexOptions }, { resourceType: regexOptions }, { tags: regexOptions }] })
        .select('title resourceType slug chapterId tags status')
        .limit(20)
        .lean()
    ]);

    const normalizeQuery = query.toLowerCase();

    const rankResult = (item) => {
      let score = 0;
      const title = item.title?.toLowerCase() || '';
      
      if (title === normalizeQuery) score += 100;
      else if (title.startsWith(normalizeQuery)) score += 50;
      else if (title.includes(normalizeQuery)) score += 25;

      if (item.tags) {
        const hasTagMatch = item.tags.some(t => t.toLowerCase().includes(normalizeQuery));
        if (hasTagMatch) score += 10;
      }
      
      return { ...item, _searchScore: score };
    };

    const rankAndSort = (items) => {
      return items.map(rankResult).sort((a, b) => b._searchScore - a._searchScore).map(i => {
        delete i._searchScore;
        return i;
      });
    };

    return {
      sheets: rankAndSort(sheets),
      subjects: rankAndSort(subjects),
      chapters: rankAndSort(chapters),
      resources: rankAndSort(resources).map(r => ({ ...r, type: r.resourceType }))
    };
  }
}
