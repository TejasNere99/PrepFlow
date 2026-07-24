import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../auth/middleware/authenticate.js';
import { authorize } from '../auth/middleware/authorize.js';
import { USER_ROLES } from '../constants/userRoles.js';
import {
  getProgress,
  getSheetProgress,
  upsertProgress,
} from '../controllers/progressController.js';

export const progressRouter = Router();

progressRouter.use(authenticate);
progressRouter.use(authorize(USER_ROLES.STUDENT, USER_ROLES.ADMIN));

progressRouter.get('/', asyncHandler(getProgress));
progressRouter.get('/:sheetId', asyncHandler(getSheetProgress));
progressRouter.post('/resource/:resourceId', asyncHandler(upsertProgress));
progressRouter.patch('/resource/:resourceId', asyncHandler(upsertProgress));
