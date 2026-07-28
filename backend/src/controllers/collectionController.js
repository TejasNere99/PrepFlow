import { collectionService } from '../services/collectionService.js';

export const collectionController = {
  async createCollection(req, res, next) {
    try {
      const { name } = req.body;
      const userId = req.user.id;
      const collection = await collectionService.createCollection(userId, name);
      res.status(201).json(collection);
    } catch (error) {
      next(error);
    }
  },

  async getCollections(req, res, next) {
    try {
      const userId = req.user.id;
      const collections = await collectionService.getCollections(userId);
      res.json(collections);
    } catch (error) {
      next(error);
    }
  },

  async renameCollection(req, res, next) {
    try {
      const { collectionId } = req.params;
      const { name } = req.body;
      const userId = req.user.id;
      const collection = await collectionService.renameCollection(userId, collectionId, name);
      res.json(collection);
    } catch (error) {
      next(error);
    }
  },

  async deleteCollection(req, res, next) {
    try {
      const { collectionId } = req.params;
      const userId = req.user.id;
      const result = await collectionService.deleteCollection(userId, collectionId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async addResourceToCollection(req, res, next) {
    try {
      const { collectionId } = req.params;
      const { resourceId } = req.body;
      const userId = req.user.id;
      const result = await collectionService.addResourceToCollection(userId, collectionId, resourceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async removeResourceFromCollection(req, res, next) {
    try {
      const { collectionId, resourceId } = req.params;
      const userId = req.user.id;
      const result = await collectionService.removeResourceFromCollection(userId, collectionId, resourceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getCollectionItems(req, res, next) {
    try {
      const { collectionId } = req.params;
      const userId = req.user.id;
      const items = await collectionService.getCollectionItems(userId, collectionId);
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
};
