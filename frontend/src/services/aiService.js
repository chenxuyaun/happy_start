import api from './api';

export const aiService = {
  // 发送消息给AI
  async sendMessage(message) {
    try {
      const response = await api.post('/ai/chat', {
        message,
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '发送消息失败');
    }
  },

  // 获取情绪建议
  async getEmotionSuggestions(emotionData) {
    try {
      const response = await api.post('/ai/emotion-suggestions', emotionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取建议失败');
    }
  },

  // 获取聊天历史
  async getChatHistory(params = {}) {
    try {
      const response = await api.get('/ai/chat-history', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取聊天历史失败');
    }
  },

  // 分析情绪
  async analyzeEmotion(text) {
    try {
      const response = await api.post('/ai/analyze-emotion', { text });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '情绪分析失败');
    }
  },

  // 获取个人化建议
  async getPersonalizedAdvice(userProfile) {
    try {
      const response = await api.post('/ai/personalized-advice', userProfile);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取个人化建议失败');
    }
  }
};
