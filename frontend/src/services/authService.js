// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API_BASE_URL = 'http://localhost:3003'; // Fallback for local development
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // Required for refresh token cookie
});

// Track refresh state to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];


const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add auth header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/refresh`, {
          withCredentials: true
        });
        
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Dispatch custom event for auth context to handle logout
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Login function
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return {
      accessToken: response.data.accessToken
    };
  } catch (error) {
    if (error.response?.data?.error) {
      throw { message: error.response.data.error };
    }
    throw { message: 'Login failed. Please try again.' };
  }
};

// Signup function
export const signup = async (userData) => {
  try {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw {
        message: error.response.data.message || 'Signup failed',
        errors: error.response.data.errors || {}
      };
    }
    throw { message: error.message || 'An error occurred' };
  }
};

// Refresh token function (for manual refresh if needed)
export const refreshAccessToken = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/auth/refresh`, {
      withCredentials: true
    });
    return response.data.accessToken;
  } catch (error) {
    throw { message: 'Session expired. Please login again.' };
  }
};

// Logout function
export const logout = async () => {
  try {
    await api.post('/api/auth/logout'); // Fixed route path
  } catch (error) {
    console.error('Logout error:', error);
    // Still proceed even if logout API fails
  }
};

// Export the configured api instance for use in other parts of your app
export { api };