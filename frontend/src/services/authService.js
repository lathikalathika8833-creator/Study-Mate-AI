import api from './api';
import { initialUserData } from '../data/mockData';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data?.token) {
        localStorage.setItem('studymate_token', response.data.token);
        localStorage.setItem('studymate_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Backend offline, using local registration simulation', error);
      const simulatedUser = {
        ...initialUserData,
        name: userData.name || "Student User",
        email: userData.email,
        college: userData.college || "University",
        major: userData.major || "Computer Science",
      };
      const simulatedToken = "jwt_mock_token_" + Date.now();
      localStorage.setItem('studymate_token', simulatedToken);
      localStorage.setItem('studymate_user', JSON.stringify(simulatedUser));
      return { token: simulatedToken, user: simulatedUser };
    }
  },

  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data?.token) {
        localStorage.setItem('studymate_token', response.data.token);
        localStorage.setItem('studymate_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      console.warn('Backend offline, using local login simulation', error);
      const user = {
        ...initialUserData,
        email: credentials.email || initialUserData.email,
      };
      const simulatedToken = "jwt_mock_token_" + Date.now();
      localStorage.setItem('studymate_token', simulatedToken);
      localStorage.setItem('studymate_user', JSON.stringify(user));
      return { token: simulatedToken, user };
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      const cached = localStorage.getItem('studymate_user');
      return cached ? JSON.parse(cached) : initialUserData;
    }
  },

  async updateProfile(updates) {
    try {
      const response = await api.put('/auth/profile', updates);
      localStorage.setItem('studymate_user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const cached = localStorage.getItem('studymate_user');
      const currentUser = cached ? JSON.parse(cached) : initialUserData;
      const updatedUser = { ...currentUser, ...updates };
      localStorage.setItem('studymate_user', JSON.stringify(updatedUser));
      return updatedUser;
    }
  },

  logout() {
    localStorage.removeItem('studymate_token');
    localStorage.removeItem('studymate_user');
  }
};
