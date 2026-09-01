import api from './api';
import { initialQuizzes } from '../data/mockData';

const QUIZ_KEY = 'studymate_quizzes';
const RESULTS_KEY = 'studymate_quiz_results';

function getLocalQuizzes() {
  const cached = localStorage.getItem(QUIZ_KEY);
  if (!cached) {
    localStorage.setItem(QUIZ_KEY, JSON.stringify(initialQuizzes));
    return initialQuizzes;
  }
  try {
    return JSON.parse(cached);
  } catch (e) {
    return initialQuizzes;
  }
}

function saveLocalQuizzes(quizzes) {
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quizzes));
}

export const quizService = {
  async getQuizzes() {
    try {
      const res = await api.get('/quizzes');
      return res.data;
    } catch (error) {
      return getLocalQuizzes();
    }
  },

  async getQuizById(id) {
    try {
      const res = await api.get(`/quizzes/${id}`);
      return res.data;
    } catch (error) {
      const quizzes = getLocalQuizzes();
      return quizzes.find(q => q.id === id) || null;
    }
  },

  async saveQuiz(quiz) {
    try {
      const res = await api.post('/quizzes', quiz);
      return res.data;
    } catch (error) {
      const quizzes = getLocalQuizzes();
      const newQuiz = {
        ...quiz,
        id: quiz.id || `quiz_${Date.now()}`
      };
      const updated = [newQuiz, ...quizzes.filter(q => q.id !== newQuiz.id)];
      saveLocalQuizzes(updated);
      return newQuiz;
    }
  },

  async saveQuizResult(resultData) {
    try {
      const res = await api.post('/quizzes/results', resultData);
      return res.data;
    } catch (error) {
      const cached = localStorage.getItem(RESULTS_KEY);
      const results = cached ? JSON.parse(cached) : [];
      const newResult = {
        ...resultData,
        id: `res_${Date.now()}`,
        completedAt: new Date().toISOString()
      };
      results.unshift(newResult);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(results));

      // Update quiz lastScore
      const quizzes = getLocalQuizzes();
      const updatedQuizzes = quizzes.map(q => q.id === resultData.quizId ? { ...q, lastScore: resultData.score } : q);
      saveLocalQuizzes(updatedQuizzes);

      return newResult;
    }
  },

  async getQuizResults() {
    try {
      const res = await api.get('/quizzes/results');
      return res.data;
    } catch (error) {
      const cached = localStorage.getItem(RESULTS_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  }
};
