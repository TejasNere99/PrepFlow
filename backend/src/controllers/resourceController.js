import * as resourceService from '../services/resourceService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const createResource = async (req, res) => {
  const resource = await resourceService.createResource(req.body);
  sendSuccess(res, 201, 'Resource created successfully', resource);
};

export const getResources = async (req, res) => {
  const { page, limit, search, status, chapterId, resourceType, sort } = req.query;
  const result = await resourceService.getResources({ page, limit, search, status, chapterId, resourceType, sort });
  
  res.status(200).json({
    success: true,
    message: 'Resources fetched successfully',
    data: result.resources,
    pagination: result.pagination,
  });
};

export const getResourceById = async (req, res) => {
  const { id } = req.params;
  const resource = await resourceService.getResourceById(id);
  sendSuccess(res, 200, 'Resource fetched successfully', resource);
};

export const updateResource = async (req, res) => {
  const { id } = req.params;
  const resource = await resourceService.updateResource(id, req.body);
  sendSuccess(res, 200, 'Resource updated successfully', resource);
};

export const archiveResource = async (req, res) => {
  const { id } = req.params;
  const resource = await resourceService.archiveResource(id);
  sendSuccess(res, 200, 'Resource archived successfully', resource);
};
