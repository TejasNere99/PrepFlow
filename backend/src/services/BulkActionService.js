import { Sheet } from '../models/Sheet.js';
import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { ENTITY_TYPES, ADMIN_ACTIONS } from '../constants/adminActions.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import { ApiError } from '../utils/ApiError.js';

class BulkActionService {
  static _getModel(entityType) {
    switch (entityType) {
      case ENTITY_TYPES.SHEET: return Sheet;
      case ENTITY_TYPES.SUBJECT: return Subject;
      case ENTITY_TYPES.CHAPTER: return Chapter;
      case ENTITY_TYPES.RESOURCE: return Resource;
      default: throw new ApiError(400, 'Invalid entity type for bulk action');
    }
  }

  static async processBulkAction(entityType, action, ids, payload = {}) {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new ApiError(400, 'No IDs provided for bulk action');
    }

    const Model = this._getModel(entityType);
    let result;

    switch (action) {
      case ADMIN_ACTIONS.BULK_DELETE:
        result = await Model.deleteMany({ _id: { $in: ids } });
        return { success: true, count: result.deletedCount, message: `Successfully deleted ${result.deletedCount} items.` };

      case ADMIN_ACTIONS.BULK_ARCHIVE:
        result = await Model.updateMany({ _id: { $in: ids } }, { $set: { status: CONTENT_STATUS.ARCHIVED } });
        return { success: true, count: result.modifiedCount, message: `Successfully archived ${result.modifiedCount} items.` };

      case ADMIN_ACTIONS.BULK_PUBLISH:
        result = await Model.updateMany({ _id: { $in: ids } }, { $set: { status: CONTENT_STATUS.ACTIVE } });
        return { success: true, count: result.modifiedCount, message: `Successfully published ${result.modifiedCount} items.` };

      case ADMIN_ACTIONS.BULK_UNPUBLISH:
        result = await Model.updateMany({ _id: { $in: ids } }, { $set: { status: CONTENT_STATUS.DRAFT } });
        return { success: true, count: result.modifiedCount, message: `Successfully unpublished ${result.modifiedCount} items.` };

      case ADMIN_ACTIONS.BULK_MOVE:
        if (!payload.parentId) {
          throw new ApiError(400, 'Parent ID required for move action');
        }
        let parentField = '';
        if (entityType === ENTITY_TYPES.SUBJECT) parentField = 'sheetId';
        else if (entityType === ENTITY_TYPES.CHAPTER) parentField = 'subjectId';
        else if (entityType === ENTITY_TYPES.RESOURCE) parentField = 'chapterId';
        else throw new ApiError(400, 'Cannot move this entity type');

        result = await Model.updateMany({ _id: { $in: ids } }, { $set: { [parentField]: payload.parentId } });
        return { success: true, count: result.modifiedCount, message: `Successfully moved ${result.modifiedCount} items.` };

      case ADMIN_ACTIONS.BULK_UPDATE_TAGS:
        if (!payload.tags || !Array.isArray(payload.tags)) {
          throw new ApiError(400, 'Tags array required for update tags action');
        }
        // Either append or replace tags depending on payload.mode (append vs replace)
        if (payload.mode === 'append') {
          result = await Model.updateMany({ _id: { $in: ids } }, { $addToSet: { tags: { $each: payload.tags } } });
        } else {
          result = await Model.updateMany({ _id: { $in: ids } }, { $set: { tags: payload.tags } });
        }
        return { success: true, count: result.modifiedCount, message: `Successfully updated tags for ${result.modifiedCount} items.` };

      default:
        throw new ApiError(400, `Bulk action ${action} is not supported.`);
    }
  }
}

export default BulkActionService;
