import { Router } from 'express';
import { authenticate } from '../auth/middleware/authenticate.js';
import { authorize } from '../auth/middleware/authorize.js';
import { USER_ROLES } from '../constants/userRoles.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  archiveResource,
} from '../controllers/resourceController.js';
import {
  validateCreateResource,
  validateUpdateResource,
} from '../validators/resourceValidator.js';

export const resourceRouter = Router();

// Protect all routes in this router to ADMIN only
resourceRouter.use(authenticate, authorize(USER_ROLES.ADMIN));

resourceRouter.post('/', validateCreateResource, asyncHandler(createResource));
resourceRouter.get('/', asyncHandler(getResources));
resourceRouter.get('/:id', asyncHandler(getResourceById));
resourceRouter.put('/:id', validateUpdateResource, asyncHandler(updateResource));
resourceRouter.delete('/:id', asyncHandler(archiveResource));
