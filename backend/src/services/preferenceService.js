import { UserResourcePreference } from '../models/UserResourcePreference.js';
import { validateResource } from '../utils/resourceValidation.js';

export const preferenceService = {
  async toggleBookmark(userId, resourceId) {
    await validateResource(resourceId);
    const pref = await UserResourcePreference.findOneAndUpdate(
      { userId, resourceId },
      { $set: { userId, resourceId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    pref.isBookmarked = !pref.isBookmarked;
    await pref.save();
    return { isBookmarked: pref.isBookmarked, isFavorite: pref.isFavorite };
  },

  async toggleFavorite(userId, resourceId) {
    await validateResource(resourceId);
    const pref = await UserResourcePreference.findOneAndUpdate(
      { userId, resourceId },
      { $set: { userId, resourceId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    pref.isFavorite = !pref.isFavorite;
    await pref.save();
    return { isBookmarked: pref.isBookmarked, isFavorite: pref.isFavorite };
  },

  async getPreferences(userId) {
    return UserResourcePreference.find({ userId })
      .select('resourceId isBookmarked isFavorite -_id')
      .lean();
  },

  async getBookmarkedResources(userId) {
    return UserResourcePreference.find({ userId, isBookmarked: true })
      .populate('resourceId', 'title slug resourceType thumbnail _id')
      .select('-__v -createdAt -updatedAt -isFavorite')
      .lean();
  },

  async getFavoritedResources(userId) {
    return UserResourcePreference.find({ userId, isFavorite: true })
      .populate('resourceId', 'title slug resourceType thumbnail _id')
      .select('-__v -createdAt -updatedAt -isBookmarked')
      .lean();
  }
};
