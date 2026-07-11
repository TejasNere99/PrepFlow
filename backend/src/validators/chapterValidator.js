import { ApiError } from '../utils/ApiError.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

export const validateCreateChapter = (req, res, next) => {
  const { subjectId, title, description, status, order, tags, metadata } = req.body;

  if (!subjectId || typeof subjectId !== 'string' || subjectId.trim().length === 0) {
    return next(new ApiError(400, 'Subject ID is required'));
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return next(new ApiError(400, 'Title is required and must be a non-empty string'));
  }

  if (description !== undefined && typeof description !== 'string') {
    return next(new ApiError(400, 'Description must be a string'));
  }

  if (status !== undefined && !Object.values(CONTENT_STATUS).includes(status)) {
    return next(new ApiError(400, `Status must be one of: ${Object.values(CONTENT_STATUS).join(', ')}`));
  }

  if (order !== undefined && order !== '' && typeof order !== 'number') {
    // If order is passed as empty string from frontend (optional), we can handle it in controller/service or reject it if it's strictly validated.
    // Let's accept if it's a number, or undefined. If it's a string that's not empty, it might be an issue. But typically we parse it.
    // Since order is optional now, if it's not a number, throw error unless it's undefined.
    return next(new ApiError(400, 'Order must be a number'));
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return next(new ApiError(400, 'Tags must be an array of strings'));
  }

  if (tags !== undefined && Array.isArray(tags)) {
    for (const tag of tags) {
      if (typeof tag !== 'string') {
        return next(new ApiError(400, 'Each tag must be a string'));
      }
    }
  }

  if (metadata !== undefined && (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata))) {
    return next(new ApiError(400, 'Metadata must be an object'));
  }

  return next();
};

export const validateUpdateChapter = (req, res, next) => {
  const { subjectId, title, description, status, order, tags, metadata } = req.body;

  if (subjectId !== undefined && (typeof subjectId !== 'string' || subjectId.trim().length === 0)) {
    return next(new ApiError(400, 'Subject ID must be a non-empty string'));
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return next(new ApiError(400, 'Title must be a non-empty string'));
  }

  if (description !== undefined && typeof description !== 'string') {
    return next(new ApiError(400, 'Description must be a string'));
  }

  if (status !== undefined && !Object.values(CONTENT_STATUS).includes(status)) {
    return next(new ApiError(400, `Status must be one of: ${Object.values(CONTENT_STATUS).join(', ')}`));
  }

  if (order !== undefined && order !== '' && typeof order !== 'number') {
    return next(new ApiError(400, 'Order must be a number'));
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return next(new ApiError(400, 'Tags must be an array of strings'));
  }

  if (tags !== undefined && Array.isArray(tags)) {
    for (const tag of tags) {
      if (typeof tag !== 'string') {
        return next(new ApiError(400, 'Each tag must be a string'));
      }
    }
  }

  if (metadata !== undefined && (typeof metadata !== 'object' || metadata === null || Array.isArray(metadata))) {
    return next(new ApiError(400, 'Metadata must be an object'));
  }

  return next();
};
