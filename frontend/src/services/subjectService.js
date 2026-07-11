import { apiClient } from './apiClient.js';

export const getSubjects = async (params = {}) => {
  const response = await apiClient.get('/api/subjects', { params });
  return response.data;
};

export const getSubject = async (id) => {
  const response = await apiClient.get(`/api/subjects/${id}`);
  return response.data;
};

export const createSubject = async (data) => {
  const response = await apiClient.post('/api/subjects', data);
  return response.data;
};

export const updateSubject = async (id, data) => {
  const response = await apiClient.put(`/api/subjects/${id}`, data);
  return response.data;
};

export const archiveSubject = async (id) => {
  const response = await apiClient.delete(`/api/subjects/${id}`);
  return response.data;
};
