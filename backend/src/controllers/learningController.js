import WeakTopicService from '../services/WeakTopicService.js';
import { RecommendationService } from '../services/RecommendationService.js';
import RevisionPriorityService from '../services/RevisionPriorityService.js';
import LearningInsightsService from '../services/LearningInsightsService.js';
import { sendIntelligenceResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWeakTopics = asyncHandler(async (req, res) => {
  const topics = await WeakTopicService.getWeakTopics(req.user.id);
  return sendIntelligenceResponse(res, 200, topics);
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await RecommendationService.getRecommendations(req.user.id);
  return sendIntelligenceResponse(res, 200, recommendations);
});

export const getRevisionPriorities = asyncHandler(async (req, res) => {
  const priorities = await RevisionPriorityService.getRevisionPriorities(req.user.id);
  return sendIntelligenceResponse(res, 200, priorities);
});

export const getLearningInsights = asyncHandler(async (req, res) => {
  const insights = await LearningInsightsService.getInsights(req.user.id);
  return sendIntelligenceResponse(res, 200, insights);
});
