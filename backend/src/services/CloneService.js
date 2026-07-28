import { Sheet } from '../models/Sheet.js';
import { Subject } from '../models/Subject.js';
import { Chapter } from '../models/Chapter.js';
import { Resource } from '../models/Resource.js';
import { ENTITY_TYPES } from '../constants/adminActions.js';
import { ApiError } from '../utils/ApiError.js';
import mongoose from 'mongoose';

class CloneService {

  static async _resolveCloneName(Model, baseTitle) {
    // Find highest " (Copy X)" suffix
    const regex = new RegExp(`^${baseTitle}( \\(Copy(?: \\d+)?\\))?$`);
    const existingDocs = await Model.find({ title: regex }).select('title').lean();
    
    if (existingDocs.length === 0) return baseTitle;

    let maxSuffix = 0;
    for (const doc of existingDocs) {
      if (doc.title === baseTitle) {
        if (maxSuffix < 1) maxSuffix = 1;
        continue;
      }
      const match = doc.title.match(/ \(Copy(?: (\d+))?\)$/);
      if (match) {
        const num = match[1] ? parseInt(match[1], 10) : 1;
        if (num > maxSuffix) maxSuffix = num;
      }
    }

    if (maxSuffix === 0) return baseTitle;
    if (maxSuffix === 1) return `${baseTitle} (Copy)`;
    return `${baseTitle} (Copy ${maxSuffix + 1})`;
  }

  static async _cloneResource(resourceId, newChapterId) {
    const original = await Resource.findById(resourceId).lean();
    if (!original) return null;

    const newTitle = await this._resolveCloneName(Resource, original.title);

    const cloned = new Resource({
      ...original,
      _id: new mongoose.Types.ObjectId(),
      title: newTitle,
      chapterId: newChapterId,
      slug: `${original.slug}-copy-${Date.now()}`,
      metadata: original.metadata || {} // Exclude student progress if it exists in metadata, but usually it's in ResourceProgress
    });
    
    await cloned.save();
    return cloned._id;
  }

  static async _cloneChapter(chapterId, newSubjectId) {
    const original = await Chapter.findById(chapterId).lean();
    if (!original) return null;

    const newTitle = await this._resolveCloneName(Chapter, original.title);

    const cloned = new Chapter({
      ...original,
      _id: new mongoose.Types.ObjectId(),
      title: newTitle,
      subjectId: newSubjectId,
      slug: `${original.slug}-copy-${Date.now()}`
    });
    
    await cloned.save();

    // Deep clone resources
    const resources = await Resource.find({ chapterId }).select('_id').lean();
    for (const res of resources) {
      await this._cloneResource(res._id, cloned._id);
    }

    return cloned._id;
  }

  static async _cloneSubject(subjectId, newSheetId) {
    const original = await Subject.findById(subjectId).lean();
    if (!original) return null;

    const newTitle = await this._resolveCloneName(Subject, original.title);

    const cloned = new Subject({
      ...original,
      _id: new mongoose.Types.ObjectId(),
      title: newTitle,
      sheetId: newSheetId,
      slug: `${original.slug}-copy-${Date.now()}`
    });
    
    await cloned.save();

    // Deep clone chapters
    const chapters = await Chapter.find({ subjectId }).select('_id').lean();
    for (const ch of chapters) {
      await this._cloneChapter(ch._id, cloned._id);
    }

    return cloned._id;
  }

  static async _cloneSheet(sheetId) {
    const original = await Sheet.findById(sheetId).lean();
    if (!original) return null;

    const newTitle = await this._resolveCloneName(Sheet, original.title);

    const cloned = new Sheet({
      ...original,
      _id: new mongoose.Types.ObjectId(),
      title: newTitle,
      slug: `${original.slug}-copy-${Date.now()}`
    });
    
    await cloned.save();

    // Deep clone subjects
    const subjects = await Subject.find({ sheetId }).select('_id').lean();
    for (const sub of subjects) {
      await this._cloneSubject(sub._id, cloned._id);
    }

    return cloned._id;
  }

  /**
   * Clone an entity deeply
   * @param {string} entityType 
   * @param {string} id 
   */
  static async cloneEntity(entityType, id) {
    switch (entityType) {
      case ENTITY_TYPES.SHEET:
        return await this._cloneSheet(id);
      case ENTITY_TYPES.SUBJECT:
        const sub = await Subject.findById(id).select('sheetId').lean();
        if (!sub) throw new ApiError(404, 'Subject not found');
        return await this._cloneSubject(id, sub.sheetId);
      case ENTITY_TYPES.CHAPTER:
        const ch = await Chapter.findById(id).select('subjectId').lean();
        if (!ch) throw new ApiError(404, 'Chapter not found');
        return await this._cloneChapter(id, ch.subjectId);
      case ENTITY_TYPES.RESOURCE:
        const res = await Resource.findById(id).select('chapterId').lean();
        if (!res) throw new ApiError(404, 'Resource not found');
        return await this._cloneResource(id, res.chapterId);
      default:
        throw new ApiError(400, 'Invalid entity type for cloning');
    }
  }
}

export default CloneService;
