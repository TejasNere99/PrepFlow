import { Router } from 'express';
import { authenticate } from '../auth/middleware/authenticate.js';
import { authorize } from '../auth/middleware/authorize.js';
import { USER_ROLES } from '../constants/userRoles.js';

import { preferenceController } from '../controllers/preferenceController.js';
import { noteController } from '../controllers/noteController.js';
import { collectionController } from '../controllers/collectionController.js';
import { revisionController } from '../controllers/revisionController.js';
import * as learningController from '../controllers/learningController.js';
import * as timelineController from '../controllers/timelineController.js';

export const studentRouter = Router();

// Apply auth and role middleware to all student routes
studentRouter.use(authenticate, authorize(USER_ROLES.STUDENT));

// Preferences
studentRouter.get('/preferences', preferenceController.getPreferences);
studentRouter.get('/bookmarks', preferenceController.getBookmarkedResources);
studentRouter.post('/bookmarks/:resourceId', preferenceController.toggleBookmark);
studentRouter.get('/favorites', preferenceController.getFavoritedResources);
studentRouter.post('/favorites/:resourceId', preferenceController.toggleFavorite);

// Notes
studentRouter.get('/notes/:resourceId', noteController.getNote);
studentRouter.put('/notes/:resourceId', noteController.saveNote);
studentRouter.delete('/notes/:resourceId', noteController.deleteNote);

// Collections
studentRouter.get('/collections', collectionController.getCollections);
studentRouter.post('/collections', collectionController.createCollection);
studentRouter.patch('/collections/:collectionId', collectionController.renameCollection);
studentRouter.delete('/collections/:collectionId', collectionController.deleteCollection);
studentRouter.get('/collections/:collectionId/items', collectionController.getCollectionItems);
studentRouter.post('/collections/:collectionId/items', collectionController.addResourceToCollection);
studentRouter.delete('/collections/:collectionId/items/:resourceId', collectionController.removeResourceFromCollection);

// Revision Planner
studentRouter.get('/revision', revisionController.getUpcomingRevisions);
studentRouter.post('/revision', revisionController.scheduleRevision);
studentRouter.patch('/revision/:scheduleId', revisionController.updateRevisionStatus);

// Smart Learning Intelligence (Sprint 17)
studentRouter.get('/weak-topics', learningController.getWeakTopics);
studentRouter.get('/recommendations', learningController.getRecommendations);
studentRouter.get('/revision-priorities', learningController.getRevisionPriorities);
studentRouter.get('/learning-insights', learningController.getLearningInsights);
studentRouter.get('/timeline', timelineController.getTimeline);
