import { sendSuccess } from '../utils/apiResponse.js';
import * as progressService from '../services/progressService.js';

export const getProgress = async (req, res) => {
  const data = await progressService.getProgressSummary(req.user.id);
  sendSuccess(res, 200, 'Progress summary fetched successfully', data);
};

export const getSheetProgress = async (req, res) => {
  const { sheetId } = req.params;
  const data = await progressService.getSheetProgress(req.user.id, sheetId);
  sendSuccess(res, 200, 'Sheet progress fetched successfully', data);
};

export const upsertProgress = async (req, res) => {
  const { resourceId } = req.params;
  const data = await progressService.upsertProgress(req.user.id, resourceId, req.body);
  sendSuccess(res, 200, 'Progress updated successfully', data);
};
