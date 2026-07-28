import { ActivityLog } from '../models/ActivityLog.js';

class ActivityLogService {
  /**
   * Log an administrative action asynchronously without blocking
   * @param {Object} params
   * @param {string} params.adminId - ObjectId of the admin user
   * @param {string} params.action - Action enum (e.g., ADMIN_ACTIONS.CREATE)
   * @param {string} params.entityType - Entity enum (e.g., ENTITY_TYPES.SHEET)
   * @param {string} [params.entityId] - ObjectId of the entity
   * @param {string} [params.entityName] - Display name of the entity
   * @param {Object} [params.metadata] - Minimal metadata (e.g., changes made)
   */
  static logAction({ adminId, action, entityType, entityId = null, entityName = '', metadata = {} }) {
    // Fire and forget to not block the main response
    ActivityLog.create({
      adminId,
      action,
      entityType,
      entityId,
      entityName,
      metadata
    }).catch((err) => {
      console.error('Failed to log admin activity:', err);
    });
  }

  static async getRecentLogs(limit = 50, skip = 0) {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('adminId', 'name email')
      .lean();

    const total = await ActivityLog.countDocuments();

    return { logs, total };
  }
}

export default ActivityLogService;
