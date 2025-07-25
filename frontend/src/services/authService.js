// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your backend URL

export const signup = async (userData) => {
  try {
    console.log(userData);
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    console.log(response);
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw {
        message: error.response.data.message || 'Signup failed',
        errors: error.response.data.errors
      };
    } else if (error.request) {
      // The request was made but no response was received
      throw { message: 'No response from server. Please try again.' };
    } else {
      // Something happened in setting up the request that triggered an Error
      throw { message: error.message || 'An error occurred' };
    }
  }
};