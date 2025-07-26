// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Keep your existing base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true // Required for refresh token cookie
});

// Login function (new)
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return {
      accessToken: response.data.accessToken 
      // Only using what backend actually returns
      // No artificial user object creation
    };
  } catch (error) {
    if (error.response?.data?.error) {
      throw { message: error.response.data.error };
    }
    throw { message: 'Login failed. Please try again.' };
  }
};
// Signup function (your existing, slightly enhanced)
export const signup = async (userData) => {
  try {
    const response = await api.post('/auth/signup', userData);
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

// Refresh token function (new)
export const refreshAccessToken = async () => {
  try {
    const response = await api.get('/auth/refresh');
    return response.data.accessToken;
  } catch (error) {
    throw { message: 'Session expired. Please login again.' };
  }
};

// Logout function (new)
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
    // Still proceed even if logout API fails
  }
};

// Add this if you need to attach token to requests
export const setAuthHeader = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};