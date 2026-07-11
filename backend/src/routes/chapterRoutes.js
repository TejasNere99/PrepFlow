import { Router } from 'express';
import { authenticate } from '../auth/middleware/authenticate.js';
import { authorize } from '../auth/middleware/authorize.js';
import { USER_ROLES } from '../constants/userRoles.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createChapter,
  getChapters,
  getChapterById,
  updateChapter,
  archiveChapter,
} from '../controllers/chapterController.js';
import {
  validateCreateChapter,
  validateUpdateChapter,
} from '../validators/chapterValidator.js';

export const chapterRouter = Router();

// Protect all routes in this router to ADMIN only
chapterRouter.use(authenticate, authorize(USER_ROLES.ADMIN));

chapterRouter.post('/', validateCreateChapter, asyncHandler(createChapter));
chapterRouter.get('/', asyncHandler(getChapters));
chapterRouter.get('/:id', asyncHandler(getChapterById));
chapterRouter.put('/:id', validateUpdateChapter, asyncHandler(updateChapter));
chapterRouter.delete('/:id', asyncHandler(archiveChapter));
