import { Router } from 'express';
import { authenticate } from '../auth/middleware/authenticate.js';
import { authorize } from '../auth/middleware/authorize.js';
import { USER_ROLES } from '../constants/userRoles.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createSheet,
  getSheets,
  getSheetById,
  updateSheet,
  archiveSheet,
} from '../controllers/sheetController.js';
import {
  validateCreateSheet,
  validateUpdateSheet,
} from '../validators/sheetValidator.js';

export const sheetRouter = Router();

// Protect all routes in this router to ADMIN only
sheetRouter.use(authenticate, authorize(USER_ROLES.ADMIN));

sheetRouter.post('/', validateCreateSheet, asyncHandler(createSheet));
sheetRouter.get('/', asyncHandler(getSheets));
sheetRouter.get('/:id', asyncHandler(getSheetById));
sheetRouter.put('/:id', validateUpdateSheet, asyncHandler(updateSheet));
sheetRouter.delete('/:id', asyncHandler(archiveSheet));
