import { apiClient } from './apiClient.js';
const api = apiClient;

const API_BASE = '/api/student';

export const studentService = {
  // Preferences
  getPreferences: async () => {
    const { data } = await api.get(`${API_BASE}/preferences`);
    return data;
  },
  getBookmarks: async () => {
    const { data } = await api.get(`${API_BASE}/bookmarks`);
    return data;
  },
  toggleBookmark: async (resourceId) => {
    const { data } = await api.post(`${API_BASE}/bookmarks/${resourceId}`);
    return data;
  },
  getFavorites: async () => {
    const { data } = await api.get(`${API_BASE}/favorites`);
    return data;
  },
  toggleFavorite: async (resourceId) => {
    const { data } = await api.post(`${API_BASE}/favorites/${resourceId}`);
    return data;
  },

  // Notes
  getNote: async (resourceId) => {
    const { data } = await api.get(`${API_BASE}/notes/${resourceId}`);
    return data;
  },
  saveNote: async (resourceId, content) => {
    const { data } = await api.put(`${API_BASE}/notes/${resourceId}`, { content });
    return data;
  },
  deleteNote: async (resourceId) => {
    const { data } = await api.delete(`${API_BASE}/notes/${resourceId}`);
    return data;
  },

  // Collections
  getCollections: async () => {
    const { data } = await api.get(`${API_BASE}/collections`);
    return data;
  },
  createCollection: async (name) => {
    const { data } = await api.post(`${API_BASE}/collections`, { name });
    return data;
  },
  renameCollection: async (collectionId, name) => {
    const { data } = await api.patch(`${API_BASE}/collections/${collectionId}`, { name });
    return data;
  },
  deleteCollection: async (collectionId) => {
    const { data } = await api.delete(`${API_BASE}/collections/${collectionId}`);
    return data;
  },
  getCollectionItems: async (collectionId) => {
    const { data } = await api.get(`${API_BASE}/collections/${collectionId}/items`);
    return data;
  },
  addResourceToCollection: async (collectionId, resourceId) => {
    const { data } = await api.post(`${API_BASE}/collections/${collectionId}/items`, { resourceId });
    return data;
  },
  removeResourceFromCollection: async (collectionId, resourceId) => {
    const { data } = await api.delete(`${API_BASE}/collections/${collectionId}/items/${resourceId}`);
    return data;
  },

  // Revision Planner
  getUpcomingRevisions: async () => {
    const { data } = await api.get(`${API_BASE}/revision`);
    return data;
  },
  scheduleRevision: async (resourceId, date) => {
    const { data } = await api.post(`${API_BASE}/revision`, { resourceId, date });
    return data;
  },
  updateRevisionStatus: async (scheduleId, status) => {
    const { data } = await api.patch(`${API_BASE}/revision/${scheduleId}`, { status });
    return data;
  }
};
