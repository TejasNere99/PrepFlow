import { apiClient } from './apiClient';

export const adminService = {
  reorder: async (entityType, updates) => {
    const { data } = await apiClient.patch('/api/admin/reorder', { entityType, updates });
    return data;
  },

  clone: async (entityType, id) => {
    const { data } = await apiClient.post('/api/admin/clone', { entityType, id });
    return data;
  },

  bulkAction: async (entityType, action, ids, payload = {}) => {
    const { data } = await apiClient.post('/api/admin/bulk-actions', { entityType, action, ids, payload });
    return data;
  },

  validateImport: async (entityType, rows, parentId) => {
    const { data } = await apiClient.post('/api/admin/import/validate', { entityType, rows, parentId });
    return data;
  },

  executeImport: async (entityType, validatedRows, parentId) => {
    const { data } = await apiClient.post('/api/admin/import/execute', { entityType, validatedRows, parentId });
    return data;
  },

  getAnalytics: async () => {
    const { data } = await apiClient.get('/api/admin/analytics');
    return data;
  },

  getActivityLogs: async (limit = 50, skip = 0) => {
    const { data } = await apiClient.get(`/api/admin/activity?limit=${limit}&skip=${skip}`);
    return data;
  }
};
