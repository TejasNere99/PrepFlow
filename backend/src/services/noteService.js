import { Note } from '../models/Note.js';
import { validateResource } from '../utils/resourceValidation.js';

export const noteService = {
  async getNote(userId, resourceId) {
    const note = await Note.findOne({ userId, resourceId, isDeleted: false })
      .select('content updatedAt -_id')
      .lean();
    return note || { content: '' };
  },

  async saveNote(userId, resourceId, content) {
    await validateResource(resourceId);
    const note = await Note.findOneAndUpdate(
      { userId, resourceId, isDeleted: false },
      { content, userId, resourceId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).select('content updatedAt -_id');
    return note;
  },

  async deleteNote(userId, resourceId) {
    await Note.findOneAndUpdate(
      { userId, resourceId },
      { isDeleted: true }
    );
    return { success: true };
  }
};
