import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// NOTE: These routes should be protected by an isAdmin middleware in production
// router.use(protect, restrictTo('admin'));

router.patch('/reorder', adminController.reorderItems);
router.post('/clone', adminController.cloneItem);
router.post('/bulk-actions', adminController.performBulkAction);
router.post('/import/validate', adminController.validateCSVImport);
router.post('/import/execute', adminController.executeCSVImport);

router.get('/analytics', adminController.getAnalytics);
router.get('/activity', adminController.getActivity);

export const adminRouter = router;
