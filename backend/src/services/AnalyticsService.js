import { Sheet } from '../models/Sheet.js';
import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

class AnalyticsService {
  /**
   * Get overarching CMS analytics using structured DTOs
   */
  static async getDashboardAnalytics() {
    // $facet allows multiple independent aggregations in a single query per collection
    // However, since they are separate collections, we do one aggregation or count per collection in parallel.
    // For performance and scalability with thousands of docs, parallel standard queries are fast enough,
    // but we can use aggregate to group by status if needed.

    const [sheetStats, subjectStats, chapterStats, resourceStats, recentResources] = await Promise.all([
      Sheet.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Subject.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Chapter.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Resource.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Resource.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt').lean()
    ]);

    // Helper to format stats from aggregation output
    const formatStats = (statsArray) => {
      let published = 0;
      let draft = 0;
      let archived = 0;

      statsArray.forEach(stat => {
        if (stat._id === CONTENT_STATUS.ACTIVE) published = stat.count;
        if (stat._id === CONTENT_STATUS.DRAFT) draft = stat.count;
        if (stat._id === CONTENT_STATUS.ARCHIVED) archived = stat.count;
      });

      return {
        total: published + draft + archived,
        published,
        draft,
        archived
      };
    };

    const dto = {
      sheets: formatStats(sheetStats),
      subjects: formatStats(subjectStats),
      chapters: formatStats(chapterStats),
      resources: formatStats(resourceStats),
      recentResources: recentResources.map(r => ({
        id: r._id,
        title: r.title,
        status: r.status,
        createdAt: r.createdAt
      }))
    };

    return dto;
  }
}

export default AnalyticsService;
