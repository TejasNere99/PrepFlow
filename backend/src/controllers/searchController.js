import { SearchService } from '../services/SearchService.js';
import { RecommendationService } from '../services/RecommendationService.js';

export const globalSearch = async (req, res) => {
  const { q } = req.query;
  const results = await SearchService.globalSearch(q);
  res.json({ success: true, data: results });
};

export const getRelatedResources = async (req, res) => {
  const { resourceId } = req.params;
  const results = await RecommendationService.getRelatedResources(resourceId);
  res.json({ success: true, data: results });
};
