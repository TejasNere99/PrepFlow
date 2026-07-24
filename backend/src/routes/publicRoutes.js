import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getPublicSheets,
  getPublicSheetBySlug,
  getPublicSubjectsBySheetId,
  getPublicChaptersBySubjectId,
  getPublicResourcesByChapterId,
  getResourceBySlug
} from '../controllers/publicController.js';
import { getChapters } from '../controllers/chapterController.js';
import { globalSearch, getRelatedResources } from '../controllers/searchController.js';

export const publicRouter = Router();

publicRouter.get('/sheets', asyncHandler(getPublicSheets));
publicRouter.get('/sheets/:slug', asyncHandler(getPublicSheetBySlug));

publicRouter.get('/search', asyncHandler(globalSearch));
publicRouter.get('/resources/:resourceId/related', asyncHandler(getRelatedResources));

publicRouter.get('/sheets/:sheetId/subjects', asyncHandler(getPublicSubjectsBySheetId));
publicRouter.get('/subjects/:subjectId/chapters', asyncHandler(getPublicChaptersBySubjectId));
publicRouter.get('/chapters/:chapterId/resources', asyncHandler(getPublicResourcesByChapterId));
publicRouter.get('/resources/:resourceSlug', asyncHandler(getResourceBySlug));
