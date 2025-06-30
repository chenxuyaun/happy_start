import api from './api';
import { mockJournalService } from './mockJournalService';

export const journalService = {
  // 是否使用模拟数据
  useMockData: process.env.NODE_ENV === 'development',

  // 创建日记
  async createJournalEntry(entryData) {
    try {
      if (this.useMockData) {
        return await mockJournalService.createJournalEntry(entryData);
      }
      const response = await api.post('/journal/entries', entryData);
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      return await mockJournalService.createJournalEntry(entryData);
    }
  },

  // 获取日记列表
  async getJournalEntries(params = {}) {
    try {
      if (this.useMockData) {
        return await mockJournalService.getJournalEntries(params);
      }
      const response = await api.get('/journal/entries', { params });
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      return await mockJournalService.getJournalEntries(params);
    }
  },

  // 获取单个日记
  async getJournalEntry(entryId) {
    try {
      if (this.useMockData) {
        // 模拟数据暂不支持单个日记获取，返回第一个
        const journals = await mockJournalService.getJournalEntries();
        return journals.journals[0] || null;
      }
      const response = await api.get(`/journal/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      const journals = await mockJournalService.getJournalEntries();
      return journals.journals[0] || null;
    }
  },

  // 更新日记
  async updateJournalEntry(entryId, entryData) {
    try {
      if (this.useMockData) {
        return await mockJournalService.updateJournalEntry(entryId, entryData);
      }
      const response = await api.put(`/journal/entries/${entryId}`, entryData);
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      return await mockJournalService.updateJournalEntry(entryId, entryData);
    }
  },

  // 删除日记
  async deleteJournalEntry(entryId) {
    try {
      if (this.useMockData) {
        return await mockJournalService.deleteJournalEntry(entryId);
      }
      const response = await api.delete(`/journal/entries/${entryId}`);
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      return await mockJournalService.deleteJournalEntry(entryId);
    }
  },

  // 获取情绪分析
  async getEmotionAnalysis(params = {}) {
    try {
      if (this.useMockData) {
        return await mockJournalService.getEmotionAnalysis(params);
      }
      const response = await api.get('/journal/emotion-analysis', { params });
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      return await mockJournalService.getEmotionAnalysis(params);
    }
  },

  // 获取情绪趋势
  async getEmotionTrends(params = {}) {
    try {
      if (this.useMockData) {
        const analysis = await mockJournalService.getEmotionAnalysis(params);
        return analysis.trends;
      }
      const response = await api.get('/journal/emotion-trends', { params });
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      const analysis = await mockJournalService.getEmotionAnalysis(params);
      return analysis.trends;
    }
  },

  // 获取日记统计
  async getJournalStats() {
    try {
      if (this.useMockData) {
        return await mockJournalService.getJournalStats();
      }
      const response = await api.get('/journal/stats');
      return response.data;
    } catch (error) {
      console.warn('API调用失败，使用模拟数据:', error.message);
      return await mockJournalService.getJournalStats();
    }
  }
};
