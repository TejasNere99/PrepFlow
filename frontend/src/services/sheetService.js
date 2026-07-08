import { apiClient } from './apiClient.js';

export const getSheets = async (params = {}) => {
  const response = await apiClient.get('/api/sheets', { params });
  return response.data;
};

export const getSheet = async (id) => {
  const response = await apiClient.get(`/api/sheets/${id}`);
  return response.data;
};

export const createSheet = async (data) => {
  const response = await apiClient.post('/api/sheets', data);
  return response.data;
};

export const updateSheet = async (id, data) => {
  const response = await apiClient.put(`/api/sheets/${id}`, data);
  return response.data;
};

export const archiveSheet = async (id) => {
  const response = await apiClient.delete(`/api/sheets/${id}`);
  return response.data;
};
