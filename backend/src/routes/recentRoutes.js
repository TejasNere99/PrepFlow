import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../auth/middleware/authenticate.js';
import { authorize } from '../auth/middleware/authorize.js';
import { USER_ROLES } from '../constants/userRoles.js';
import { getRecentActivity } from '../controllers/recentActivityController.js';

export const recentRouter = Router();

recentRouter.use(authenticate);
recentRouter.use(authorize(USER_ROLES.STUDENT, USER_ROLES.ADMIN));

recentRouter.get('/recent', asyncHandler(getRecentActivity));
