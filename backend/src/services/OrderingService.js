import { Sheet } from '../models/Sheet.js';
import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { ENTITY_TYPES } from '../constants/adminActions.js';
import { ApiError } from '../utils/ApiError.js';

class OrderingService {
  static _getModel(entityType) {
    switch (entityType) {
      case ENTITY_TYPES.SHEET: return Sheet;
      case ENTITY_TYPES.SUBJECT: return Subject;
      case ENTITY_TYPES.CHAPTER: return Chapter;
      case ENTITY_TYPES.RESOURCE: return Resource;
      default: throw new ApiError(400, 'Invalid entity type for reordering.');
    }
  }

  static _getParentField(entityType) {
    switch (entityType) {
      case ENTITY_TYPES.SHEET: return null; // Sheets have no parent in this context
      case ENTITY_TYPES.SUBJECT: return 'sheetId';
      case ENTITY_TYPES.CHAPTER: return 'subjectId';
      case ENTITY_TYPES.RESOURCE: return 'chapterId';
      default: return null;
    }
  }

  /**
   * Reorder items within the same parent
   * @param {string} entityType 
   * @param {Array<{id: string, displayOrder: number}>} updates 
   */
  static async reorder(entityType, updates) {
    if (!updates || !Array.isArray(updates) || updates.length === 0) {
      return { success: true, message: 'No updates provided' };
    }

    const Model = this._getModel(entityType);
    const parentField = this._getParentField(entityType);

    // To enforce parent scoping, we first fetch the items to ensure they all belong to the same parent
    if (parentField) {
      const itemIds = updates.map(u => u.id);
      const items = await Model.find({ _id: { $in: itemIds } }).select(parentField);
      
      if (items.length === 0) {
        throw new ApiError(404, 'Entities not found');
      }
      
      const parentId = items[0][parentField].toString();
      const allSameParent = items.every(item => item[parentField].toString() === parentId);
      
      if (!allSameParent) {
        throw new ApiError(400, 'Cross-parent ordering is not allowed');
      }
    }

    const bulkOps = updates.map(update => ({
      updateOne: {
        filter: { _id: update.id },
        update: { $set: { displayOrder: update.displayOrder } }
      }
    }));

    await Model.bulkWrite(bulkOps);

    return { success: true, message: 'Ordering updated successfully' };
  }
}

export default OrderingService;
