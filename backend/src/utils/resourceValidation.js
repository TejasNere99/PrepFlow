import { Resource } from '../models/Resource.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';

export const validateResource = async (resourceId) => {
  const resource = await Resource.findById(resourceId);
  if (!resource) {
    throw new Error('Resource not found');
  }
  if (resource.status !== CONTENT_STATUS.ACTIVE) {
    throw new Error('Resource is not active');
  }
  return resource;
};
