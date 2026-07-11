import * as chapterService from '../services/chapterService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createChapter = async (req, res) => {
  const chapter = await chapterService.createChapter(req.body);
  sendSuccess(res, 201, 'Chapter created successfully', chapter);
};

export const getChapters = async (req, res) => {
  const { page, limit, search, status, subjectId, sort } = req.query;
  const result = await chapterService.getChapters({ page, limit, search, status, subjectId, sort });
  
  res.status(200).json({
    success: true,
    message: 'Chapters fetched successfully',
    data: result.chapters,
    pagination: result.pagination,
  });
};

export const getChapterById = async (req, res) => {
  const { id } = req.params;
  const chapter = await chapterService.getChapterById(id);
  sendSuccess(res, 200, 'Chapter fetched successfully', chapter);
};

export const updateChapter = async (req, res) => {
  const { id } = req.params;
  const chapter = await chapterService.updateChapter(id, req.body);
  sendSuccess(res, 200, 'Chapter updated successfully', chapter);
};

export const archiveChapter = async (req, res) => {
  const { id } = req.params;
  const chapter = await chapterService.archiveChapter(id);
  sendSuccess(res, 200, 'Chapter archived successfully', chapter);
};
