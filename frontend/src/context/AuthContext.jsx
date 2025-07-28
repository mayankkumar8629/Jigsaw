

import { createContext, useState, useEffect, useContext } from 'react';
import { login, logout } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage if it exists
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('accessToken') || null;
  });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = async (email, password) => {
    const { accessToken } = await login(email, password);
    setAccessToken(accessToken);
    localStorage.setItem('accessToken', accessToken);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      // Clear all auth cookies
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      setIsLoggingOut(false);
    }
  };

  // Listen for automatic logout events from the interceptor
  useEffect(() => {
    const handleAutoLogout = () => {
      setAccessToken(null);
      localStorage.removeItem('accessToken');
    };

    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, []);

  // Update token state when localStorage changes (for multi-tab sync)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'accessToken') {
        setAccessToken(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!accessToken,
      isLoggingOut,
      login: handleLogin,
      logout: handleLogout,
      accessToken // Expose token if needed elsewhere
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};