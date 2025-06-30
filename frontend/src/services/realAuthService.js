import { userApi } from './api';
import { API_CONFIG } from '../config/apiConfig';
import storageService from './storageService';

export const realAuthService = {
  // 用户登录
  async login(credentials) {
    try {
      const response = await userApi.post(API_CONFIG.ENDPOINTS.USER.LOGIN, {
        email: credentials.email,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false
      });

      const { token, refreshToken, user } = response.data || response;

      if (token) {
        // 存储认证信息
        localStorage.setItem('token', token);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }
        
        // 存储用户信息
        storageService.setUserInfo(user);
        
        return {
          success: true,
          user,
          token,
          message: '登录成功'
        };
      } else {
        throw new Error('登录响应格式错误');
      }
    } catch (error) {
      console.error('登录失败:', error);
      throw new Error(error.response?.data?.message || '登录失败，请检查用户名和密码');
    }
  },

  // 用户注册
  async register(userData) {
    try {
      const response = await userApi.post(API_CONFIG.ENDPOINTS.USER.REGISTER, {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
        gender: userData.gender,
        agreeToTerms: userData.agreeToTerms
      });

      const { token, user } = response.data || response;

      if (token) {
        localStorage.setItem('token', token);
        storageService.setUserInfo(user);
      }

      return {
        success: true,
        user,
        token,
        message: '注册成功'
      };
    } catch (error) {
      console.error('注册失败:', error);
      throw new Error(error.response?.data?.message || '注册失败，请检查输入信息');
    }
  },

  // 用户注销
  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // 通知服务端用户注销（可选）
        await userApi.post('/auth/logout');
      }
    } catch (error) {
      console.warn('注销请求失败:', error);
    } finally {
      // 清除本地存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      storageService.clearUserInfo();
    }

    return {
      success: true,
      message: '注销成功'
    };
  },

  // 获取用户信息
  async getUserProfile() {
    try {
      const response = await userApi.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
      const user = response.data || response;
      
      // 更新本地存储的用户信息
      storageService.setUserInfo(user);
      
      return {
        success: true,
        user,
        message: '用户信息获取成功'
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      throw new Error(error.response?.data?.message || '获取用户信息失败');
    }
  },

  // 更新用户信息
  async updateUserProfile(userData) {
    try {
      const response = await userApi.put(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        birthDate: userData.birthDate,
        gender: userData.gender,
        bio: userData.bio,
        preferences: userData.preferences,
        avatar: userData.avatar
      });

      const user = response.data || response;
      storageService.setUserInfo(user);

      return {
        success: true,
        user,
        message: '用户信息更新成功'
      };
    } catch (error) {
      console.error('更新用户信息失败:', error);
      throw new Error(error.response?.data?.message || '更新用户信息失败');
    }
  },

  // 修改密码
  async changePassword(passwordData) {
    try {
      await userApi.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      return {
        success: true,
        message: '密码修改成功'
      };
    } catch (error) {
      console.error('修改密码失败:', error);
      throw new Error(error.response?.data?.message || '修改密码失败');
    }
  },

  // 忘记密码
  async forgotPassword(email) {
    try {
      await userApi.post(API_CONFIG.ENDPOINTS.USER.FORGOT_PASSWORD, { email });
      
      return {
        success: true,
        message: '重置密码邮件已发送，请检查您的邮箱'
      };
    } catch (error) {
      console.error('发送重置密码邮件失败:', error);
      throw new Error(error.response?.data?.message || '发送重置密码邮件失败');
    }
  },

  // 重置密码
  async resetPassword(resetData) {
    try {
      await userApi.post(API_CONFIG.ENDPOINTS.USER.RESET_PASSWORD, {
        token: resetData.token,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword
      });

      return {
        success: true,
        message: '密码重置成功，请使用新密码登录'
      };
    } catch (error) {
      console.error('重置密码失败:', error);
      throw new Error(error.response?.data?.message || '重置密码失败');
    }
  },

  // 刷新令牌
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('没有刷新令牌');
      }

      const response = await userApi.post(API_CONFIG.ENDPOINTS.USER.REFRESH_TOKEN, {
        refreshToken
      });

      const { token, refreshToken: newRefreshToken } = response.data || response;

      if (token) {
        localStorage.setItem('token', token);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
      }

      return {
        success: true,
        token,
        message: '令牌刷新成功'
      };
    } catch (error) {
      console.error('刷新令牌失败:', error);
      // 刷新失败时清除所有认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      storageService.clearUserInfo();
      throw new Error('登录已过期，请重新登录');
    }
  },

  // 验证当前token是否有效
  async validateToken() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { success: false, message: '没有登录令牌' };
      }

      const response = await userApi.get('/auth/validate');
      
      return {
        success: true,
        user: response.data || response,
        message: '令牌验证成功'
      };
    } catch (error) {
      console.error('令牌验证失败:', error);
      // 验证失败时尝试刷新令牌
      try {
        return await this.refreshToken();
      } catch (refreshError) {
        return { 
          success: false, 
          message: '登录已过期，请重新登录' 
        };
      }
    }
  },

  // 检查是否已登录
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const userInfo = storageService.getUserInfo();
    return !!(token && userInfo);
  },

  // 获取当前用户信息
  getCurrentUser() {
    return storageService.getUserInfo();
  }
};

export default realAuthService;
