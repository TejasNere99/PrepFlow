import { apiClient } from './apiClient.js';

export const progressApi = {
  getProgressSummary: () => apiClient.get('/api/progress'),
  getSheetProgress: (sheetId) => apiClient.get(`/api/progress/${sheetId}`),
  upsertProgress: (resourceId, data) => apiClient.post(`/api/progress/resource/${resourceId}`, data),
};
