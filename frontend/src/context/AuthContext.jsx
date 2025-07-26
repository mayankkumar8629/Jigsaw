import { createContext, useState, useEffect, useContext } from 'react';
import { login,logout,refreshAccessToken } from '../services/authService.js';


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
      setAccessToken(null);
      localStorage.removeItem('accessToken');
      // Clear all auth cookies
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check for existing token on app start
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  // Token refresh logic
  useEffect(() => {
    if (!accessToken) return; // Don't refresh if not logged in

    const refresh = async () => {
      try {
        const newToken = await refreshAccessToken();
        setAccessToken(newToken);
        localStorage.setItem('accessToken', newToken);
      } catch {
        handleLogout(); // Auto-logout if refresh fails
      }
    };

    const interval = setInterval(refresh, 14 * 60 * 1000); // Refresh every 14 mins
    return () => clearInterval(interval);
  }, [accessToken]); // Add accessToken as dependency

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: !!accessToken,
      isLoggingOut,
      login: handleLogin,
      logout: handleLogout 
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