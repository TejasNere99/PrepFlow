import { apiClient } from './apiClient.js';

const API_BASE = '/api/student/planner';

export const plannerApi = {
  getTodayPlan: (params = {}) => apiClient.get(`${API_BASE}/today`, { params }),
  getWeeklyPlan: (params = {}) => apiClient.get(`${API_BASE}/week`, { params }),
  generatePlan: (payload = {}) => apiClient.post(`${API_BASE}/generate`, payload),
  regeneratePlan: (payload = {}) => apiClient.post(`${API_BASE}/regenerate`, payload),
  updateTask: (taskId, payload) => apiClient.patch(`${API_BASE}/tasks/${taskId}`, payload),
};
