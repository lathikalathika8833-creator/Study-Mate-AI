import api from './api';
import { initialStudyPlans } from '../data/mockData';

const PLANS_KEY = 'studymate_study_plans';

function getLocalPlans() {
  const cached = localStorage.getItem(PLANS_KEY);
  if (!cached) {
    localStorage.setItem(PLANS_KEY, JSON.stringify(initialStudyPlans));
    return initialStudyPlans;
  }
  try {
    return JSON.parse(cached);
  } catch (e) {
    return initialStudyPlans;
  }
}

function saveLocalPlans(plans) {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}

export const plannerService = {
  async getStudyPlans() {
    try {
      const res = await api.get('/study-plans');
      return res.data;
    } catch (error) {
      return getLocalPlans();
    }
  },

  async saveStudyPlan(plan) {
    try {
      const res = await api.post('/study-plans', plan);
      return res.data;
    } catch (error) {
      const plans = getLocalPlans();
      const newPlan = {
        ...plan,
        id: plan.id || `plan_${Date.now()}`,
        createdAt: plan.createdAt || new Date().toISOString()
      };
      const updated = [newPlan, ...plans.filter(p => p.id !== newPlan.id)];
      saveLocalPlans(updated);
      return newPlan;
    }
  },

  async toggleBlockCompletion(planId, dayIndex, blockId, completed) {
    try {
      const res = await api.patch(`/study-plans/${planId}/blocks/${blockId}`, { completed });
      return res.data;
    } catch (error) {
      const plans = getLocalPlans();
      const updated = plans.map(plan => {
        if (plan.id === planId) {
          const newDays = [...plan.days];
          if (newDays[dayIndex]) {
            newDays[dayIndex] = {
              ...newDays[dayIndex],
              blocks: newDays[dayIndex].blocks.map(b => b.id === blockId ? { ...b, completed } : b)
            };
          }
          return { ...plan, days: newDays };
        }
        return plan;
      });
      saveLocalPlans(updated);
      return updated.find(p => p.id === planId);
    }
  },

  async deleteStudyPlan(id) {
    try {
      await api.delete(`/study-plans/${id}`);
      return true;
    } catch (error) {
      const plans = getLocalPlans();
      const updated = plans.filter(p => p.id !== id);
      saveLocalPlans(updated);
      return true;
    }
  }
};
