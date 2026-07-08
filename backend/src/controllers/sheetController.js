import * as sheetService from '../services/sheetService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createSheet = async (req, res) => {
  const userId = req.user.id;
  const sheet = await sheetService.createSheet(req.body, userId);
  sendSuccess(res, 201, 'Sheet created successfully', sheet);
};

export const getSheets = async (req, res) => {
  const { page, limit, search, status, sort } = req.query;
  const result = await sheetService.getSheets({ page, limit, search, status, sort });
  
  res.status(200).json({
    success: true,
    message: 'Sheets fetched successfully',
    data: result.sheets,
    pagination: result.pagination,
  });
};

export const getSheetById = async (req, res) => {
  const { id } = req.params;
  const sheet = await sheetService.getSheetById(id);
  sendSuccess(res, 200, 'Sheet fetched successfully', sheet);
};

export const updateSheet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const sheet = await sheetService.updateSheet(id, req.body, userId);
  sendSuccess(res, 200, 'Sheet updated successfully', sheet);
};

export const archiveSheet = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const sheet = await sheetService.archiveSheet(id, userId);
  sendSuccess(res, 200, 'Sheet archived successfully', sheet);
};
