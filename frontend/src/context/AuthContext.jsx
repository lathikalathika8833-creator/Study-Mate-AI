import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { initialUserData } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('studymate_token');
      const storedUser = localStorage.getItem('studymate_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } catch (e) {
          console.error("Failed to parse user data from storage", e);
        }
      } else {
        // Auto-seed demo user on initial load for instant seamless preview
        setUser(initialUserData);
        const demoToken = "jwt_mock_token_initial";
        setToken(demoToken);
        localStorage.setItem('studymate_token', demoToken);
        localStorage.setItem('studymate_user', JSON.stringify(initialUserData));
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Invalid email or password' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      setToken(data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Registration failed. Try again.' };
    } finally {
      setLoading(false);
    }
  };

  const loginDemoUser = () => {
    setUser(initialUserData);
    const demoToken = "jwt_demo_token_" + Date.now();
    setToken(demoToken);
    localStorage.setItem('studymate_token', demoToken);
    localStorage.setItem('studymate_user', JSON.stringify(initialUserData));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    loginDemoUser,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
