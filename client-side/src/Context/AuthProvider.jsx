import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false
  });

  const verifyAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState(prev => ({ ...prev, loading: false, isAuthenticated: false }));
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
          isAuthenticated: true
        });
      } else {
        localStorage.removeItem('token');
        setAuthState({
          user: null,
          loading: false,
          error: 'Session expired',
          isAuthenticated: false
        });
      }
    } catch (err) {
      localStorage.removeItem('token');
      setAuthState({
        user: null,
        loading: false,
        error: err.message,
        isAuthenticated: false
      });
    }
  }, []);

  useEffect(() => {
    verifyAuth();
    
    const refreshInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      if (token && authState.isAuthenticated) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/refresh`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (response.ok) {
            const { token: newToken } = await response.json();
            localStorage.setItem('token', newToken);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [verifyAuth, authState.isAuthenticated]);

  const login = async (credentials) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      
      setAuthState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true
      });
      
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const { token, user } = await response.json();
      localStorage.setItem('token', token);
      
      setAuthState({
        user,
        loading: false,
        error: null,
        isAuthenticated: true
      });
      
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
      return { success: false, error: error.message };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false
    });
    // Navigation removed from here
  }, []);

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/auth/refresh`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const { token: newToken } = await response.json();
        localStorage.setItem('token', newToken);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      register,
      logout,
      refreshToken,
      verifyAuth
    }}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;