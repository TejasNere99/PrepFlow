import { apiClient } from './apiClient.js';

export const learningApi = {
  getWeakTopics: () => apiClient.get('/api/student/weak-topics'),
  getRecommendations: () => apiClient.get('/api/student/recommendations'),
  getRevisionPriorities: () => apiClient.get('/api/student/revision-priorities'),
  getLearningInsights: () => apiClient.get('/api/student/learning-insights'),
  getTimeline: (limit = 15) => apiClient.get(`/api/student/timeline?limit=${limit}`),
};
