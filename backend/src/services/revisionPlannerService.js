import { RevisionSchedule, REVISION_STATUS } from '../models/RevisionSchedule.js';
import { validateResource } from '../utils/resourceValidation.js';

export const revisionPlannerService = {
  async scheduleRevision(userId, resourceId, date) {
    await validateResource(resourceId);
    
    const schedule = await RevisionSchedule.findOneAndUpdate(
      { userId, resourceId, status: { $in: [REVISION_STATUS.UPCOMING, REVISION_STATUS.MISSED] } },
      { date, status: REVISION_STATUS.UPCOMING, userId, resourceId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select('date status _id');
    
    return schedule;
  },

  async getUpcomingRevisions(userId) {
    return RevisionSchedule.find({
      userId,
      status: REVISION_STATUS.UPCOMING,
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    })
      .populate('resourceId', 'title slug resourceType thumbnail _id')
      .select('-__v -createdAt -updatedAt')
      .sort({ date: 1 })
      .lean();
  },

  async updateRevisionStatus(userId, scheduleId, status) {
    if (!Object.values(REVISION_STATUS).includes(status)) {
      throw new Error('Invalid status');
    }
    
    const schedule = await RevisionSchedule.findOneAndUpdate(
      { _id: scheduleId, userId },
      { status },
      { new: true }
    ).select('date status _id');
    
    if (!schedule) throw new Error('Revision schedule not found');
    return schedule;
  }
};
