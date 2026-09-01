import api from './api';
import { progressAnalyticsData } from '../data/mockData';

export const progressService = {
  async getProgress() {
    try {
      const res = await api.get('/progress');
      return res.data;
    } catch (error) {
      // Calculate dynamic progress combining mock baseline and local results
      const cachedResults = localStorage.getItem('studymate_quiz_results');
      const results = cachedResults ? JSON.parse(cachedResults) : [];
      
      let quizAvg = 89;
      let totalQuizzes = 12 + results.length;
      if (results.length > 0) {
        const sum = results.reduce((acc, r) => acc + (r.score || 0), 0);
        quizAvg = Math.round((sum + (89 * 12)) / (12 + results.length));
      }

      return {
        ...progressAnalyticsData,
        quizAverage: quizAvg,
        totalQuizzes,
        completedTopics: 24,
        studyHours: 16.5,
        streak: 7
      };
    }
  }
};
