import * as subjectService from '../services/subjectService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createSubject = async (req, res) => {
  const subject = await subjectService.createSubject(req.body);
  sendSuccess(res, 201, 'Subject created successfully', subject);
};

export const getSubjects = async (req, res) => {
  const { page, limit, search, status, sheetId, sort } = req.query;
  const result = await subjectService.getSubjects({ page, limit, search, status, sheetId, sort });
  
  res.status(200).json({
    success: true,
    message: 'Subjects fetched successfully',
    data: result.subjects,
    pagination: result.pagination,
  });
};

export const getSubjectById = async (req, res) => {
  const { id } = req.params;
  const subject = await subjectService.getSubjectById(id);
  sendSuccess(res, 200, 'Subject fetched successfully', subject);
};

export const updateSubject = async (req, res) => {
  const { id } = req.params;
  const subject = await subjectService.updateSubject(id, req.body);
  sendSuccess(res, 200, 'Subject updated successfully', subject);
};

export const archiveSubject = async (req, res) => {
  const { id } = req.params;
  const subject = await subjectService.archiveSubject(id);
  sendSuccess(res, 200, 'Subject archived successfully', subject);
};
