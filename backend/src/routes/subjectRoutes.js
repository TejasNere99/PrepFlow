import { Router } from 'express';
import { authenticate } from '../auth/middleware/authenticate.js';
import { authorize } from '../auth/middleware/authorize.js';
import { USER_ROLES } from '../constants/userRoles.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  archiveSubject,
} from '../controllers/subjectController.js';
import {
  validateCreateSubject,
  validateUpdateSubject,
} from '../validators/subjectValidator.js';

export const subjectRouter = Router();

// Protect all routes in this router to ADMIN only
subjectRouter.use(authenticate, authorize(USER_ROLES.ADMIN));

subjectRouter.post('/', validateCreateSubject, asyncHandler(createSubject));
subjectRouter.get('/', asyncHandler(getSubjects));
subjectRouter.get('/:id', asyncHandler(getSubjectById));
subjectRouter.put('/:id', validateUpdateSubject, asyncHandler(updateSubject));
subjectRouter.delete('/:id', asyncHandler(archiveSubject));
