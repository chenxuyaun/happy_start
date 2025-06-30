import { API_CONFIG } from '../config/apiConfig';

// 导入真实服务
import realJournalService from './realJournalService';
import realAuthService from './realAuthService';

// 导入模拟服务
import { mockJournalService } from './mockJournalService';
import { authService as mockAuthService } from './authService';

// 获取是否使用模拟数据的配置
const useMockData = API_CONFIG.USE_MOCK_DATA || process.env.NODE_ENV === 'development';

// 服务管理器
export const serviceManager = {
  // 获取服务配置
  getConfig() {
    return {
      useMockData,
      apiUrl: API_CONFIG.BASE_URL,
      debug: API_CONFIG.DEBUG
    };
  },

  // 日记服务
  get journalService() {
    if (useMockData) {
      console.log('📊 使用模拟日记服务');
      return this.createServiceProxy(mockJournalService, realJournalService);
    } else {
      console.log('🌐 使用真实日记服务');
      return this.createServiceProxy(realJournalService, mockJournalService);
    }
  },

  // 认证服务
  get authService() {
    if (useMockData) {
      console.log('🔐 使用模拟认证服务');
      return this.createServiceProxy(mockAuthService, realAuthService);
    } else {
      console.log('🔒 使用真实认证服务');
      return this.createServiceProxy(realAuthService, mockAuthService);
    }
  },

  // 创建服务代理，在主服务失败时自动切换到备用服务
  createServiceProxy(primaryService, fallbackService) {
    return new Proxy(primaryService, {
      get(target, prop) {
        if (typeof target[prop] === 'function') {
          return async (...args) => {
            try {
              // 首先尝试使用主服务
              const result = await target[prop](...args);
              return result;
            } catch (error) {
              console.warn(`主服务 ${prop} 调用失败:`, error.message);
              
              // 如果主服务失败且有备用服务，尝试使用备用服务
              if (fallbackService && typeof fallbackService[prop] === 'function') {
                console.log(`🔄 切换到备用服务执行 ${prop}`);
                try {
                  return await fallbackService[prop](...args);
                } catch (fallbackError) {
                  console.error(`备用服务 ${prop} 也失败:`, fallbackError.message);
                  throw error; // 抛出原始错误
                }
              } else {
                throw error;
              }
            }
          };
        }
        return target[prop];
      }
    });
  },

  // 动态切换到模拟数据模式
  switchToMockMode() {
    console.log('🔄 切换到模拟数据模式');
    API_CONFIG.USE_MOCK_DATA = true;
    // 可以在这里添加通知用户的逻辑
    this.notifyModeChange('mock');
  },

  // 动态切换到真实数据模式
  switchToRealMode() {
    console.log('🔄 切换到真实数据模式');
    API_CONFIG.USE_MOCK_DATA = false;
    // 可以在这里添加通知用户的逻辑
    this.notifyModeChange('real');
  },

  // 通知模式变化
  notifyModeChange(mode) {
    const event = new CustomEvent('serviceManagerModeChange', {
      detail: { mode, timestamp: new Date().toISOString() }
    });
    window.dispatchEvent(event);
  },

  // 测试后端连接
  async testBackendConnection() {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (response.ok) {
        console.log('✅ 后端连接正常');
        return { success: true, message: '后端连接正常' };
      } else {
        console.warn('⚠️ 后端响应异常:', response.status);
        return { success: false, message: `后端响应异常: ${response.status}` };
      }
    } catch (error) {
      console.error('❌ 后端连接失败:', error.message);
      return { success: false, message: `后端连接失败: ${error.message}` };
    }
  },

  // 获取服务状态
  getServiceStatus() {
    return {
      useMockData,
      services: {
        journal: useMockData ? 'mock' : 'real',
        auth: useMockData ? 'mock' : 'real'
      },
      config: {
        apiUrl: API_CONFIG.BASE_URL,
        debug: API_CONFIG.DEBUG,
        timeout: API_CONFIG.TIMEOUT
      }
    };
  }
};

// 启动时检查后端连接状态
if (!useMockData) {
  serviceManager.testBackendConnection().then(result => {
    if (!result.success) {
      console.warn('🔄 后端连接失败，自动切换到模拟数据模式');
      serviceManager.switchToMockMode();
    }
  });
}

export default serviceManager;
