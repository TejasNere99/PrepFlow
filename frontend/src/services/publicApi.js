import axios from 'axios';

const publicClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

const PUBLIC_API_URL = '/api/public';

export const publicApi = {
  getSheets: async (params = {}) => {
    const response = await publicClient.get(`${PUBLIC_API_URL}/sheets`, { params });
    return response.data;
  },

  getSheetBySlug: async (slug) => {
    const response = await publicClient.get(`${PUBLIC_API_URL}/sheets/${slug}`);
    return response.data;
  },

  getSubjects: async (sheetId, params = {}) => {
    const response = await publicClient.get(`${PUBLIC_API_URL}/sheets/${sheetId}/subjects`, { params });
    return response.data;
  },

  getChapters: async (subjectId, params = {}) => {
    const response = await publicClient.get(`${PUBLIC_API_URL}/subjects/${subjectId}/chapters`, { params });
    return response.data;
  },

  getResources: async (chapterId, params = {}) => {
    const response = await publicClient.get(`${PUBLIC_API_URL}/chapters/${chapterId}/resources`, { params });
    return response.data;
  },
};
