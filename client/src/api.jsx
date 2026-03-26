import axios from 'axios';

const apiAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

apiAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const shouldUseMock = import.meta.env.VITE_USE_MOCK_API === 'true';
const fakeAxios = {
  get: (...args) => Promise.reject(new Error(`Mock API not configured for GET ${args[0] || ''}`)),
  post: (...args) => Promise.reject(new Error(`Mock API not configured for POST ${args[0] || ''}`)),
  put: (...args) => Promise.reject(new Error(`Mock API not configured for PUT ${args[0] || ''}`)),
  delete: (...args) => Promise.reject(new Error(`Mock API not configured for DELETE ${args[0] || ''}`)),
};

const api = shouldUseMock ? fakeAxios : apiAxios;

export default api;