import * as sheetService from '../services/sheetService.js';
import * as subjectService from '../services/subjectService.js';
import * as chapterService from '../services/chapterService.js';
import * as resourceService from '../services/resourceService.js';
import { CONTENT_STATUS } from '../constants/contentStatus.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const getPublicSheets = async (req, res) => {
  const { page, limit, search, sort } = req.query;
  const result = await sheetService.getSheets({ page, limit, search, status: CONTENT_STATUS.ACTIVE, sort });
  
  res.status(200).json({
    success: true,
    message: 'Public sheets fetched successfully',
    data: result.sheets,
    pagination: result.pagination,
  });
};

export const getPublicSheetBySlug = async (req, res) => {
  const { slug } = req.params;
  const sheet = await sheetService.getSheetBySlug(slug);
  // Ensure it's active
  if (sheet.status !== CONTENT_STATUS.ACTIVE) {
    return res.status(404).json({ success: false, message: 'Sheet not found' });
  }
  sendSuccess(res, 200, 'Public sheet fetched successfully', sheet);
};

export const getPublicSubjectsBySheetId = async (req, res) => {
  const { sheetId } = req.params;
  const { page, limit, search, sort } = req.query;
  const result = await subjectService.getSubjects({ page, limit, search, sheetId, status: CONTENT_STATUS.ACTIVE, sort });
  
  res.status(200).json({
    success: true,
    message: 'Public subjects fetched successfully',
    data: result.subjects,
    pagination: result.pagination,
  });
};

export const getPublicChaptersBySubjectId = async (req, res) => {
  const { subjectId } = req.params;
  const { page, limit, search, sort } = req.query;
  const result = await chapterService.getChapters({ page, limit, search, subjectId, status: CONTENT_STATUS.ACTIVE, sort });
  
  res.status(200).json({
    success: true,
    message: 'Public chapters fetched successfully',
    data: result.chapters,
    pagination: result.pagination,
  });
};

export const getPublicResourcesByChapterId = async (req, res) => {
  const { chapterId } = req.params;
  const { page, limit, search, resourceType, sort } = req.query;
  const result = await resourceService.getResources({ page, limit, search, chapterId, resourceType, status: CONTENT_STATUS.ACTIVE, sort });
  
  res.status(200).json({
    success: true,
    message: 'Public resources fetched successfully',
    data: result.resources,
    pagination: result.pagination,
  });
};

export const getResourceBySlug = async (req, res) => {
  const { resourceSlug } = req.params;
  const resource = await resourceService.getResourceBySlug(resourceSlug);

  if (!resource || resource.status !== CONTENT_STATUS.ACTIVE) {
    return res.status(404).json({ success: false, message: 'Resource not found' });
  }
  
  sendSuccess(res, 200, 'Resource fetched successfully', resource);
};
