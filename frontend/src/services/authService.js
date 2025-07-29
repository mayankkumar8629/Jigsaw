
import axios from 'axios';

const API_BASE_URL ='https://jigsaw-s7qa.onrender.com' ;



const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true 
});


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

// Refresh token function 
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
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {}, // Empty body if not needed
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        withCredentials: true,
      }
    );

    // Clear frontend tokens regardless of response
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new CustomEvent('auth:logout'));

    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    
    // Still clear tokens on error
    localStorage.removeItem('accessToken');
    window.dispatchEvent(new CustomEvent('auth:logout'));

    throw error; // Optional: Re-throw if caller needs to handle it
  }
};

export { api };