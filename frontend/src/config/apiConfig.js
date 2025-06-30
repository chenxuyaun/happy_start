// API配置文件
export const API_CONFIG = {
  // 基础配置
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000,
  USE_MOCK_DATA: process.env.REACT_APP_USE_MOCK_DATA === 'true',
  DEBUG: process.env.REACT_APP_DEBUG === 'true',
  
  // 各服务端点
  ENDPOINTS: {
    // 用户服务
    USER: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      REFRESH_TOKEN: '/auth/refresh',
    },
    
    // 日记服务
    JOURNAL: {
      LIST: '/journal/entries',
      CREATE: '/journal/entries',
      UPDATE: '/journal/entries',
      DELETE: '/journal/entries',
      GET_BY_ID: '/journal/entries',
      SEARCH: '/journal/search',
      EXPORT: '/journal/export',
      TAGS: '/journal/tags',
    },
    
    // 花园服务
    GARDEN: {
      STATUS: '/garden/status',
      PLANT: '/garden/plant',
      WATER: '/garden/water',
      HARVEST: '/garden/harvest',
      ITEMS: '/garden/items',
      ACHIEVEMENTS: '/garden/achievements',
    },
    
    // AI助手服务
    AI: {
      CHAT: '/ai/chat',
      ANALYZE_MOOD: '/ai/analyze-mood',
      GENERATE_SUGGESTIONS: '/ai/suggestions',
      MEDITATION_GUIDE: '/ai/meditation',
    },
    
    // 冥想服务
    MEDITATION: {
      SESSIONS: '/meditation/sessions',
      START_SESSION: '/meditation/start',
      END_SESSION: '/meditation/end',
      TRACKS: '/meditation/tracks',
      PROGRESS: '/meditation/progress',
    },
    
    // 通知服务
    NOTIFICATION: {
      LIST: '/notifications',
      MARK_READ: '/notifications/read',
      SETTINGS: '/notifications/settings',
      SUBSCRIBE: '/notifications/subscribe',
    },
    
    // 数据导出服务
    EXPORT: {
      JOURNAL: '/export/journal',
      PROGRESS: '/export/progress',
      MEDITATION: '/export/meditation',
      FULL_DATA: '/export/all',
    },
    
    // 社交分享服务
    SOCIAL: {
      SHARE_ACHIEVEMENT: '/social/share/achievement',
      SHARE_PROGRESS: '/social/share/progress',
      SHARE_QUOTE: '/social/share/quote',
      GET_SHARE_SETTINGS: '/social/settings',
      UPDATE_SHARE_SETTINGS: '/social/settings',
    }
  },
  
  // 环境配置
  ENVIRONMENTS: {
    development: {
      API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080',
    },
    staging: {
      API_URL: 'https://staging-api.happyday.com/api',
      WEBSOCKET_URL: 'wss://staging-api.happyday.com',
    },
    production: {
      API_URL: process.env.REACT_APP_API_URL || 'https://api.happyday.com/api',
      WEBSOCKET_URL: process.env.REACT_APP_WEBSOCKET_URL || 'wss://api.happyday.com',
    }
  }
};

// 获取当前环境配置
export const getCurrentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return API_CONFIG.ENVIRONMENTS[env] || API_CONFIG.ENVIRONMENTS.development;
};

// 构建完整的API URL
export const buildApiUrl = (endpoint, params = {}) => {
  const config = getCurrentConfig();
  let url = `${config.API_URL}${endpoint}`;
  
  // 替换URL参数
  Object.keys(params).forEach(key => {
    url = url.replace(`:${key}`, params[key]);
  });
  
  return url;
};
