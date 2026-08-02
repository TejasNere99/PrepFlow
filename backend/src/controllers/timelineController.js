import TimelineService from '../services/TimelineService.js';
import { sendIntelligenceResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getTimeline = asyncHandler(async (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 15;
  const timeline = await TimelineService.getTimeline(req.user.id, limit);
  return sendIntelligenceResponse(res, 200, timeline);
});
