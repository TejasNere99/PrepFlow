import { noteService } from '../services/noteService.js';

export const noteController = {
  async getNote(req, res, next) {
    try {
      const { resourceId } = req.params;
      const userId = req.user.id;
      const note = await noteService.getNote(userId, resourceId);
      res.json(note);
    } catch (error) {
      next(error);
    }
  },

  async saveNote(req, res, next) {
    try {
      const { resourceId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;
      const note = await noteService.saveNote(userId, resourceId, content);
      res.json(note);
    } catch (error) {
      next(error);
    }
  },

  async deleteNote(req, res, next) {
    try {
      const { resourceId } = req.params;
      const userId = req.user.id;
      const result = await noteService.deleteNote(userId, resourceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
};
