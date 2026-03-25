import axios from 'axios';
import mockApi from './mock/api.jsx';

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

const api = shouldUseMock ? mockApi : apiAxios;

export default api;
