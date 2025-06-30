import axios from 'axios';
import { getCurrentConfig, API_CONFIG } from '../config/apiConfig';
import storageService from './storageService';

// 获取当前环境配置
const config = getCurrentConfig();

// 创建API实例
const api = axios.create({
  baseURL: config.API_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理常见错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // 未授权，清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          throw new Error('访问被拒绝');
        case 404:
          throw new Error('请求的资源不存在');
        case 422:
          // 验证错误
          throw new Error(data.message || '输入数据有误');
        case 500:
          throw new Error('服务器内部错误');
        default:
          throw new Error(data.message || '请求失败');
      }
    } else if (error.request) {
      // 网络错误
      throw new Error('网络连接失败，请检查网络设置');
    } else {
      throw new Error('请求配置错误');
    }
  }
);

// 创建各服务的API实例
export const userApi = axios.create({
  baseURL: process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8080',
  timeout: 10000,
});

export const journalApi = axios.create({
  baseURL: process.env.REACT_APP_JOURNAL_SERVICE_URL || 'http://localhost:3002',
  timeout: 10000,
});

export const gardenApi = axios.create({
  baseURL: process.env.REACT_APP_GARDEN_SERVICE_URL || 'http://localhost:3003',
  timeout: 10000,
});

export const aiApi = axios.create({
  baseURL: process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:3004',
  timeout: 30000, // AI服务可能需要更长时间
});

// 为所有API实例添加相同的拦截器
[userApi, journalApi, gardenApi, aiApi].forEach(apiInstance => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiInstance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw error;
    }
  );
});

export default api;
