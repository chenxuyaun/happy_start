import api from './api';

export const meditationService = {
  // 获取冥想课程列表
  async getMeditationSessions(params = {}) {
    try {
      const response = await api.get('/meditation/sessions', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取冥想课程失败');
    }
  },

  // 获取单个冥想课程
  async getMeditationSession(sessionId) {
    try {
      const response = await api.get(`/meditation/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取课程详情失败');
    }
  },

  // 开始冥想
  async startMeditation(sessionData) {
    try {
      const response = await api.post('/meditation/start', sessionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '开始冥想失败');
    }
  },

  // 完成冥想
  async completeMeditation(sessionId, completionData) {
    try {
      const response = await api.post(`/meditation/sessions/${sessionId}/complete`, completionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '完成冥想失败');
    }
  },

  // 获取冥想历史
  async getMeditationHistory(params = {}) {
    try {
      const response = await api.get('/meditation/history', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取冥想历史失败');
    }
  },

  // 获取冥想统计
  async getMeditationStats() {
    try {
      const response = await api.get('/meditation/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取统计数据失败');
    }
  },

  // 获取推荐课程
  async getRecommendedSessions() {
    try {
      const response = await api.get('/meditation/recommended');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取推荐课程失败');
    }
  },

  // 创建自定义冥想
  async createCustomSession(sessionData) {
    try {
      const response = await api.post('/meditation/custom', sessionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '创建自定义冥想失败');
    }
  },

  // 获取冥想音频
  async getMeditationAudio(sessionId) {
    try {
      const response = await api.get(`/meditation/sessions/${sessionId}/audio`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取音频失败');
    }
  }
};
