import { preferenceService } from '../services/preferenceService.js';

export const preferenceController = {
  async toggleBookmark(req, res, next) {
    try {
      const { resourceId } = req.params;
      const userId = req.user.id;
      const result = await preferenceService.toggleBookmark(userId, resourceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async toggleFavorite(req, res, next) {
    try {
      const { resourceId } = req.params;
      const userId = req.user.id;
      const result = await preferenceService.toggleFavorite(userId, resourceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getPreferences(req, res, next) {
    try {
      const userId = req.user.id;
      const preferences = await preferenceService.getPreferences(userId);
      res.json(preferences);
    } catch (error) {
      next(error);
    }
  },

  async getBookmarkedResources(req, res, next) {
    try {
      const userId = req.user.id;
      const bookmarks = await preferenceService.getBookmarkedResources(userId);
      res.json(bookmarks);
    } catch (error) {
      next(error);
    }
  },

  async getFavoritedResources(req, res, next) {
    try {
      const userId = req.user.id;
      const favorites = await preferenceService.getFavoritedResources(userId);
      res.json(favorites);
    } catch (error) {
      next(error);
    }
  }
};
