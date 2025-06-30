import { userApi } from './api';

export const authService = {
  // 用户登录
  async login(credentials) {
    try {
      const response = await userApi.post('/api/v1/auth/login', credentials);
      return response;
    } catch (error) {
      // 处理验证错误，显示具体的错误信息
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          // 如果是数组，取第一个错误信息
          throw new Error(error.response.data.message[0]);
        } else {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('登录失败，请检查用户名和密码');
    }
  },

  // 用户注册
  async register(userData) {
    try {
      const response = await userApi.post('/api/v1/auth/register', userData);
      return response;
    } catch (error) {
      // 处理验证错误，显示具体的错误信息
      if (error.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          // 如果是数组，取第一个错误信息
          throw new Error(error.response.data.message[0]);
        } else {
          throw new Error(error.response.data.message);
        }
      }
      throw new Error('注册失败，请检查输入信息');
    }
  },

  // 获取当前用户信息
  async getCurrentUser() {
    try {
      const response = await userApi.get('/api/v1/auth/me');
      return response.user;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取用户信息失败');
    }
  },

  // 刷新token
  async refreshToken() {
    try {
      const response = await userApi.post('/api/v1/auth/refresh');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || '刷新token失败');
    }
  },

  // 用户登出
  async logout() {
    try {
      await userApi.post('/api/v1/auth/logout');
      localStorage.removeItem('token');
    } catch (error) {
      // 即使logout失败也要清除本地token
      localStorage.removeItem('token');
      throw new Error(error.response?.data?.message || '登出失败');
    }
  },

  // 忘记密码
  async forgotPassword(email) {
    try {
      const response = await userApi.post('/api/v1/auth/forgot-password', { email });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || '发送重置邮件失败');
    }
  },

  // 重置密码
  async resetPassword(token, newPassword) {
    try {
      const response = await userApi.post('/api/v1/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || '重置密码失败');
    }
  },

  // 修改密码
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await userApi.put('/api/v1/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || '修改密码失败');
    }
  },

  // 验证邮箱
  async verifyEmail(token) {
    try {
      const response = await userApi.post('/api/v1/auth/verify-email', { token });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || '邮箱验证失败');
    }
  },

  // 重新发送验证邮件
  async resendVerificationEmail() {
    try {
      const response = await userApi.post('/api/v1/auth/resend-verification');
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || '发送验证邮件失败');
    }
  },

  // 检查token是否有效
  isTokenValid() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      // 简单的token格式验证（实际应用中应该验证过期时间等）
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // 获取token
  getToken() {
    return localStorage.getItem('token');
  },

  // 设置token
  setToken(token) {
    localStorage.setItem('token', token);
  },
};
