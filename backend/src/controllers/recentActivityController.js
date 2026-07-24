import { RecentActivityService } from '../services/RecentActivityService.js';

export const getRecentActivity = async (req, res) => {
  const userId = req.user.id; // Requires authentication
  console.log(`[getRecentActivity] Fetching for userId: ${userId}`);
  const results = await RecentActivityService.getRecentlyViewed(userId, 10);
  console.log(`[getRecentActivity] Results count: ${results.length}`);
  res.json({ success: true, data: results });
};
