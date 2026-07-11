import { apiClient } from './apiClient.js';

export const getChapters = async (params = {}) => {
  const response = await apiClient.get('/api/chapters', { params });
  return response.data;
};

export const getChapter = async (id) => {
  const response = await apiClient.get(`/api/chapters/${id}`);
  return response.data;
};

export const createChapter = async (data) => {
  const response = await apiClient.post('/api/chapters', data);
  return response.data;
};

export const updateChapter = async (id, data) => {
  const response = await apiClient.put(`/api/chapters/${id}`, data);
  return response.data;
};

export const archiveChapter = async (id) => {
  const response = await apiClient.delete(`/api/chapters/${id}`);
  return response.data;
};
