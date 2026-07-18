import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getPublicSheets,
  getPublicSheetBySlug,
  getPublicSubjectsBySheetId,
  getPublicChaptersBySubjectId,
  getPublicResourcesByChapterId
} from '../controllers/publicController.js';

export const publicRouter = Router();

publicRouter.get('/sheets', asyncHandler(getPublicSheets));
publicRouter.get('/sheets/:slug', asyncHandler(getPublicSheetBySlug));
publicRouter.get('/sheets/:sheetId/subjects', asyncHandler(getPublicSubjectsBySheetId));
publicRouter.get('/subjects/:subjectId/chapters', asyncHandler(getPublicChaptersBySubjectId));
publicRouter.get('/chapters/:chapterId/resources', asyncHandler(getPublicResourcesByChapterId));
