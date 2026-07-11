import { ApiError } from '../utils/ApiError.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

const isValidUrl = (urlStr) => {
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (e) {
    return false;
  }
};

export const validateCreateResource = (req, res, next) => {
  const { chapterId, title, resourceType, url, storageUrl, description, status, order, tags, metadata } = req.body;

  if (!chapterId || typeof chapterId !== 'string' || chapterId.trim().length === 0) {
    return next(new ApiError(400, 'Chapter ID is required'));
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return next(new ApiError(400, 'Title is required and must be a non-empty string'));
  }

  if (!resourceType || typeof resourceType !== 'string' || resourceType.trim().length === 0) {
    return next(new ApiError(400, 'Resource Type is required and must be a non-empty string'));
  }

  // URL Validation
  const hasExternal = url && typeof url === 'string' && url.trim().length > 0;
  const hasStorage = storageUrl && typeof storageUrl === 'string' && storageUrl.trim().length > 0;

  if (!hasExternal && !hasStorage) {
    return next(new ApiError(400, 'At least one valid URL (External or Storage) is required'));
  }

  if (hasExternal && !isValidUrl(url.trim())) {
    return next(new ApiError(400, 'External URL is invalid'));
  }

  if (hasStorage && !isValidUrl(storageUrl.trim())) {
    return next(new ApiError(400, 'Storage URL is invalid'));
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

export const validateUpdateResource = (req, res, next) => {
  const { chapterId, title, resourceType, url, storageUrl, description, status, order, tags, metadata } = req.body;

  if (chapterId !== undefined && (typeof chapterId !== 'string' || chapterId.trim().length === 0)) {
    return next(new ApiError(400, 'Chapter ID must be a non-empty string'));
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return next(new ApiError(400, 'Title must be a non-empty string'));
  }

  if (resourceType !== undefined && (typeof resourceType !== 'string' || resourceType.trim().length === 0)) {
    return next(new ApiError(400, 'Resource Type must be a non-empty string'));
  }

  // Only validate URLs if they are provided during update
  if (url !== undefined || storageUrl !== undefined) {
    const hasExternal = url && typeof url === 'string' && url.trim().length > 0;
    const hasStorage = storageUrl && typeof storageUrl === 'string' && storageUrl.trim().length > 0;

    if (url !== undefined && hasExternal && !isValidUrl(url.trim())) {
      return next(new ApiError(400, 'External URL is invalid'));
    }

    if (storageUrl !== undefined && hasStorage && !isValidUrl(storageUrl.trim())) {
      return next(new ApiError(400, 'Storage URL is invalid'));
    }
    
    // Note: We don't enforce "at least one" here because update might be partial.
    // The service handles full updates where replacing both with empty might be rejected if neither exists.
    // However, if we do a full replacement, we can validate it in service or assume the client passes both.
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
