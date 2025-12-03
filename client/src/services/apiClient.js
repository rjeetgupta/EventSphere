// src/services/apiClient.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 30 seconds timeout
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add access token to headers
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData - let browser set Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor setup function
export const setupInterceptors = (store) => {
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle network errors
      if (!error.response) {
        console.error('Network error:', error.message);
        return Promise.reject({
          message: 'Network error. Please check your internet connection.',
        });
      }

      const { status, data } = error.response;

      // Handle 401/403 or token expiration
      if (
        (status === 401 || status === 403) &&
        !originalRequest._retry
      ) {
        // Check if it's a token expiration error
        if (
          data?.message === 'jwt expired' ||
          data?.message === 'Token expired' ||
          data?.error === 'jwt expired'
        ) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh-token`,
              { refreshToken },
              { withCredentials: true }
            );

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            // Update tokens
            localStorage.setItem('accessToken', accessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed - logout user
            console.error('Token refresh failed:', refreshError);
            handleAuthFailure(store);
            return Promise.reject(refreshError);
          }
        } else {
          // Other auth errors - logout immediately
          handleAuthFailure(store);
        }
      }

      // Handle other errors
      return Promise.reject(error);
    }
  );
};

// Helper function to handle authentication failures
const handleAuthFailure = (store) => {
  // Clear local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');

  // Dispatch logout action if store is available
  if (store) {
    import('@/store/authSlice').then(({ logout }) => {
      store.dispatch(logout());
    });
  }

  // Redirect to login
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

export default apiClient;