import { ApiError } from '../utils/ApiError.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

export const validateCreateSubject = (req, res, next) => {
  const { sheetId, title, description, status, order, tags, metadata } = req.body;

  if (!sheetId || typeof sheetId !== 'string' || sheetId.trim().length === 0) {
    return next(new ApiError(400, 'Sheet ID is required'));
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

  if (order !== undefined && typeof order !== 'number') {
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

export const validateUpdateSubject = (req, res, next) => {
  const { sheetId, title, description, status, order, tags, metadata } = req.body;

  if (sheetId !== undefined && (typeof sheetId !== 'string' || sheetId.trim().length === 0)) {
    return next(new ApiError(400, 'Sheet ID must be a non-empty string'));
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

  if (order !== undefined && typeof order !== 'number') {
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
