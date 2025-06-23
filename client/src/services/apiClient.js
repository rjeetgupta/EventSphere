import axios from 'axios';
import { logout } from '@/store/authSlice';

// Use relative URL for API requests to work with the proxy
const API_URL = '/api/v1';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If data is FormData, remove Content-Type header to let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setupInterceptors = (store) => {
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const { status, data } = error.response || {};

      // Check for token expiration or unauthorized errors
      if (status === 401 || status === 403 || data?.message === 'jwt expired') {
        // Dispatch logout action
        store.dispatch(logout());
        // Redirect to login page
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );
}

export default apiClient; 