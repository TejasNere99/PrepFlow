import { asyncHandler } from '../utils/asyncHandler.js';
import OrderingService from '../services/OrderingService.js';
import CloneService from '../services/CloneService.js';
import BulkActionService from '../services/BulkActionService.js';
import CSVImportService from '../services/CSVImportService.js';
import AnalyticsService from '../services/AnalyticsService.js';
import ActivityLogService from '../services/ActivityLogService.js';
import { ADMIN_ACTIONS } from '../constants/adminActions.js';

// TODO: In a real app, `adminId` would be extracted from `req.user._id` set by auth middleware.
// For now, we use a placeholder or check if user exists.
const getAdminId = (req) => {
  return req.user ? req.user._id : '64a7b8e9f1a2b3c4d5e6f7a8'; // Mock Admin ID for Sprint 16 testing
};

export const reorderItems = asyncHandler(async (req, res) => {
  const { entityType, updates } = req.body;
  const result = await OrderingService.reorder(entityType, updates);
  
  ActivityLogService.logAction({
    adminId: getAdminId(req),
    action: ADMIN_ACTIONS.REORDER,
    entityType,
    metadata: { updatesCount: updates?.length }
  });

  res.status(200).json({ status: 'success', data: result });
});

export const cloneItem = asyncHandler(async (req, res) => {
  const { entityType, id } = req.body;
  const newId = await CloneService.cloneEntity(entityType, id);

  ActivityLogService.logAction({
    adminId: getAdminId(req),
    action: ADMIN_ACTIONS.CLONE,
    entityType,
    entityId: newId
  });

  res.status(201).json({ status: 'success', data: { newId } });
});

export const performBulkAction = asyncHandler(async (req, res) => {
  const { entityType, action, ids, payload } = req.body;
  const result = await BulkActionService.processBulkAction(entityType, action, ids, payload);

  ActivityLogService.logAction({
    adminId: getAdminId(req),
    action,
    entityType,
    metadata: { idsCount: ids?.length, ...payload }
  });

  res.status(200).json({ status: 'success', data: result });
});

export const validateCSVImport = asyncHandler(async (req, res) => {
  const { entityType, rows, parentId } = req.body;
  const result = await CSVImportService.validateImport(entityType, rows, parentId);
  res.status(200).json({ status: 'success', data: result });
});

export const executeCSVImport = asyncHandler(async (req, res) => {
  const { entityType, validatedRows, parentId } = req.body;
  const result = await CSVImportService.executeImport(entityType, validatedRows, parentId);

  ActivityLogService.logAction({
    adminId: getAdminId(req),
    action: ADMIN_ACTIONS.IMPORT_CSV,
    entityType,
    metadata: { summary: result.summary, parentId }
  });

  res.status(200).json({ status: 'success', data: result });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const result = await AnalyticsService.getDashboardAnalytics();
  res.status(200).json({ status: 'success', data: result });
});

export const getActivity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  
  const result = await ActivityLogService.getRecentLogs(limit, skip);
  res.status(200).json({ status: 'success', data: result });
});
