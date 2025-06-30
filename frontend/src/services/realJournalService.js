import { journalApi } from './api';
import { API_CONFIG } from '../config/apiConfig';

export const realJournalService = {
  // 创建日记
  async createJournalEntry(entryData) {
    try {
      const response = await journalApi.post(API_CONFIG.ENDPOINTS.JOURNAL.CREATE, {
        title: entryData.title,
        content: entryData.content,
        emotion: entryData.emotion,
        mood: entryData.mood,
        stress: entryData.stress,
        energy: entryData.energy,
        tags: entryData.tags || [],
        date: entryData.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return {
        success: true,
        data: response.data || response,
        message: '日记创建成功'
      };
    } catch (error) {
      console.error('创建日记失败:', error);
      throw new Error(error.response?.data?.message || '创建日记失败');
    }
  },

  // 获取日记列表
  async getJournalEntries(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        sortBy: params.sortBy || 'createdAt',
        sortOrder: params.sortOrder || 'desc',
        emotion: params.emotion,
        startDate: params.startDate,
        endDate: params.endDate,
        search: params.search,
        tags: params.tags ? params.tags.join(',') : undefined
      };

      // 清除 undefined 值
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await journalApi.get(API_CONFIG.ENDPOINTS.JOURNAL.LIST, {
        params: queryParams
      });

      return {
        success: true,
        journals: response.data?.journals || response.data || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        totalPages: response.data?.totalPages || 1
      };
    } catch (error) {
      console.error('获取日记列表失败:', error);
      throw new Error(error.response?.data?.message || '获取日记列表失败');
    }
  },

  // 获取单个日记
  async getJournalEntry(entryId) {
    try {
      const response = await journalApi.get(`${API_CONFIG.ENDPOINTS.JOURNAL.GET_BY_ID}/${entryId}`);
      return {
        success: true,
        data: response.data || response
      };
    } catch (error) {
      console.error('获取日记详情失败:', error);
      throw new Error(error.response?.data?.message || '获取日记详情失败');
    }
  },

  // 更新日记
  async updateJournalEntry(entryId, entryData) {
    try {
      const response = await journalApi.put(`${API_CONFIG.ENDPOINTS.JOURNAL.UPDATE}/${entryId}`, {
        title: entryData.title,
        content: entryData.content,
        emotion: entryData.emotion,
        mood: entryData.mood,
        stress: entryData.stress,
        energy: entryData.energy,
        tags: entryData.tags || [],
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        data: response.data || response,
        message: '日记更新成功'
      };
    } catch (error) {
      console.error('更新日记失败:', error);
      throw new Error(error.response?.data?.message || '更新日记失败');
    }
  },

  // 删除日记
  async deleteJournalEntry(entryId) {
    try {
      await journalApi.delete(`${API_CONFIG.ENDPOINTS.JOURNAL.DELETE}/${entryId}`);
      return {
        success: true,
        message: '日记删除成功'
      };
    } catch (error) {
      console.error('删除日记失败:', error);
      throw new Error(error.response?.data?.message || '删除日记失败');
    }
  },

  // 搜索日记
  async searchJournalEntries(searchParams) {
    try {
      const response = await journalApi.post(API_CONFIG.ENDPOINTS.JOURNAL.SEARCH, {
        query: searchParams.query,
        contentType: searchParams.contentType,
        emotion: searchParams.emotion,
        dateRange: searchParams.dateRange,
        tags: searchParams.tags,
        sortBy: searchParams.sortBy || 'relevance',
        sortOrder: searchParams.sortOrder || 'desc',
        page: searchParams.page || 1,
        limit: searchParams.limit || 10
      });

      return {
        success: true,
        results: response.data?.results || response.data || [],
        total: response.data?.total || 0,
        page: response.data?.page || 1,
        totalPages: response.data?.totalPages || 1
      };
    } catch (error) {
      console.error('搜索日记失败:', error);
      throw new Error(error.response?.data?.message || '搜索日记失败');
    }
  },

  // 获取情绪分析
  async getEmotionAnalysis(params = {}) {
    try {
      const response = await journalApi.get('/journal/emotion-analysis', {
        params: {
          period: params.period || '30d',
          startDate: params.startDate,
          endDate: params.endDate
        }
      });

      return {
        success: true,
        analysis: response.data?.analysis || response.data || {
          trends: [],
          distribution: [],
          insights: [],
          averages: { mood: 3, stress: 3, energy: 3 }
        }
      };
    } catch (error) {
      console.error('获取情绪分析失败:', error);
      // 返回默认数据而不是抛出错误
      return {
        success: false,
        analysis: {
          trends: [],
          distribution: [],
          insights: ['暂无足够数据进行分析'],
          averages: { mood: 3, stress: 3, energy: 3 }
        },
        message: '情绪分析数据获取失败'
      };
    }
  },

  // 获取日记统计
  async getJournalStats() {
    try {
      const response = await journalApi.get('/journal/stats');
      return {
        success: true,
        stats: response.data?.stats || response.data || {
          totalEntries: 0,
          thisWeekEntries: 0,
          thisMonthEntries: 0,
          streakDays: 0,
          averageMood: 3,
          mostUsedTags: [],
          moodDistribution: {}
        }
      };
    } catch (error) {
      console.error('获取日记统计失败:', error);
      // 返回默认统计数据
      return {
        success: false,
        stats: {
          totalEntries: 0,
          thisWeekEntries: 0,
          thisMonthEntries: 0,
          streakDays: 0,
          averageMood: 3,
          mostUsedTags: [],
          moodDistribution: {}
        },
        message: '统计数据获取失败'
      };
    }
  },

  // 获取标签列表
  async getTags() {
    try {
      const response = await journalApi.get(API_CONFIG.ENDPOINTS.JOURNAL.TAGS);
      return {
        success: true,
        tags: response.data?.tags || response.data || []
      };
    } catch (error) {
      console.error('获取标签列表失败:', error);
      return {
        success: false,
        tags: [],
        message: '标签列表获取失败'
      };
    }
  },

  // 导出日记数据
  async exportJournalData(format = 'json', params = {}) {
    try {
      const response = await journalApi.post(API_CONFIG.ENDPOINTS.EXPORT.JOURNAL, {
        format,
        startDate: params.startDate,
        endDate: params.endDate,
        includeImages: params.includeImages || false,
        includeAnalysis: params.includeAnalysis || false
      }, {
        responseType: 'blob'
      });

      return {
        success: true,
        data: response.data || response,
        filename: response.headers['content-disposition'] 
          ? response.headers['content-disposition'].split('filename=')[1] 
          : `journal_export_${new Date().toISOString().split('T')[0]}.${format}`
      };
    } catch (error) {
      console.error('导出日记数据失败:', error);
      throw new Error(error.response?.data?.message || '导出数据失败');
    }
  }
};

export default realJournalService;
