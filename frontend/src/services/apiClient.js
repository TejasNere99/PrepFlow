import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

apiClient.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      token = token.trim();
      if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }
      if (token.startsWith("'") && token.endsWith("'")) {
        token = token.slice(1, -1);
      }
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
      // In Axios >=1.5, use config.headers.set if possible:
      if (typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

