import { revisionPlannerService } from '../services/revisionPlannerService.js';

export const revisionController = {
  async scheduleRevision(req, res, next) {
    try {
      const { resourceId, date } = req.body;
      const userId = req.user.id;
      const schedule = await revisionPlannerService.scheduleRevision(userId, resourceId, date);
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  },

  async getUpcomingRevisions(req, res, next) {
    try {
      const userId = req.user.id;
      const revisions = await revisionPlannerService.getUpcomingRevisions(userId);
      res.json(revisions);
    } catch (error) {
      next(error);
    }
  },

  async updateRevisionStatus(req, res, next) {
    try {
      const { scheduleId } = req.params;
      const { status } = req.body;
      const userId = req.user.id;
      const schedule = await revisionPlannerService.updateRevisionStatus(userId, scheduleId, status);
      res.json(schedule);
    } catch (error) {
      next(error);
    }
  }
};
