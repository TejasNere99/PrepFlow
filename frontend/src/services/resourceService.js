import { apiClient } from './apiClient.js';

export const getResources = async (params = {}) => {
  const response = await apiClient.get('/api/resources', { params });
  return response.data;
};

export const getResource = async (id) => {
  const response = await apiClient.get(`/api/resources/${id}`);
  return response.data;
};

export const createResource = async (data) => {
  const response = await apiClient.post('/api/resources', data);
  return response.data;
};

export const updateResource = async (id, data) => {
  const response = await apiClient.put(`/api/resources/${id}`, data);
  return response.data;
};

export const archiveResource = async (id) => {
  const response = await apiClient.delete(`/api/resources/${id}`);
  return response.data;
};
