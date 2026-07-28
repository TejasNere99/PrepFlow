import { Collection } from '../models/Collection.js';
import { CollectionItem } from '../models/CollectionItem.js';
import { validateResource } from '../utils/resourceValidation.js';

export const collectionService = {
  async createCollection(userId, name) {
    const collection = await Collection.create({ userId, name });
    return { id: collection._id, name: collection.name };
  },

  async getCollections(userId) {
    const collections = await Collection.find({ userId, isDeleted: false })
      .select('name _id')
      .lean();
    
    // Also fetch item counts or actual items if needed, but let's keep it thin
    return collections;
  },

  async renameCollection(userId, collectionId, name) {
    const collection = await Collection.findOneAndUpdate(
      { _id: collectionId, userId, isDeleted: false },
      { name },
      { new: true }
    ).select('name _id');
    if (!collection) throw new Error('Collection not found');
    return collection;
  },

  async deleteCollection(userId, collectionId) {
    const collection = await Collection.findOneAndUpdate(
      { _id: collectionId, userId },
      { isDeleted: true }
    );
    if (!collection) throw new Error('Collection not found');
    return { success: true };
  },

  async addResourceToCollection(userId, collectionId, resourceId) {
    await validateResource(resourceId);
    
    // Verify ownership
    const collection = await Collection.findOne({ _id: collectionId, userId, isDeleted: false });
    if (!collection) throw new Error('Collection not found');

    await CollectionItem.findOneAndUpdate(
      { collectionId, resourceId },
      { collectionId, resourceId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { success: true };
  },

  async removeResourceFromCollection(userId, collectionId, resourceId) {
    // Verify ownership
    const collection = await Collection.findOne({ _id: collectionId, userId, isDeleted: false });
    if (!collection) throw new Error('Collection not found');

    await CollectionItem.findOneAndDelete({ collectionId, resourceId });
    return { success: true };
  },

  async getCollectionItems(userId, collectionId) {
    // Verify ownership
    const collection = await Collection.findOne({ _id: collectionId, userId, isDeleted: false });
    if (!collection) throw new Error('Collection not found');

    return CollectionItem.find({ collectionId })
      .populate('resourceId', 'title slug resourceType thumbnail _id')
      .select('-__v -createdAt -updatedAt')
      .sort({ addedAt: -1 })
      .lean();
  }
};
