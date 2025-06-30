// 本地存储服务
class StorageService {
  constructor() {
    this.storageKey = 'happyday_data';
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24小时过期
  }

  // 检查localStorage是否可用
  isStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // 获取所有本地数据
  getAllLocalData() {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch (error) {
      console.error('获取本地数据失败:', error);
      return this.getDefaultData();
    }
  }

  // 获取默认数据结构
  getDefaultData() {
    return {
      user: null,
      journal: {
        entries: [],
        tags: [],
        lastSync: null,
      },
      garden: {
        plants: [],
        achievements: [],
        wateringHistory: [],
        lastSync: null,
      },
      meditation: {
        sessions: [],
        progress: [],
        tracks: [],
        lastSync: null,
      },
      settings: {
        notifications: {
          journalReminder: true,
          meditationReminder: true,
          wateringReminder: true,
          reminderTime: '20:00',
        },
        theme: 'light',
        language: 'zh-CN',
      },
      cache: {},
      lastUpdated: new Date().toISOString(),
    };
  }

  // 保存所有数据
  saveAllData(data) {
    if (!this.isStorageAvailable()) return false;
    
    try {
      const dataToSave = {
        ...data,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('保存本地数据失败:', error);
      return false;
    }
  }

  // 获取特定模块数据
  getModuleData(module) {
    const allData = this.getAllLocalData();
    return allData?.[module] || null;
  }

  // 保存特定模块数据
  saveModuleData(module, data) {
    const allData = this.getAllLocalData();
    allData[module] = {
      ...allData[module],
      ...data,
      lastSync: new Date().toISOString(),
    };
    return this.saveAllData(allData);
  }

  // 日记相关存储
  saveJournalEntry(entry) {
    const journalData = this.getModuleData('journal');
    const entries = journalData?.entries || [];
    
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    if (existingIndex >= 0) {
      entries[existingIndex] = { ...entry, updatedAt: new Date().toISOString() };
    } else {
      entries.push({ ...entry, createdAt: new Date().toISOString() });
    }
    
    return this.saveModuleData('journal', { entries });
  }

  getJournalEntries(filters = {}) {
    const journalData = this.getModuleData('journal');
    let entries = journalData?.entries || [];
    
    // 应用过滤器
    if (filters.startDate) {
      entries = entries.filter(entry => 
        new Date(entry.date) >= new Date(filters.startDate)
      );
    }
    
    if (filters.endDate) {
      entries = entries.filter(entry => 
        new Date(entry.date) <= new Date(filters.endDate)
      );
    }
    
    if (filters.mood) {
      entries = entries.filter(entry => entry.mood === filters.mood);
    }
    
    if (filters.tag) {
      entries = entries.filter(entry => 
        entry.tags && entry.tags.includes(filters.tag)
      );
    }
    
    return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  deleteJournalEntry(entryId) {
    const journalData = this.getModuleData('journal');
    const entries = journalData?.entries || [];
    const filteredEntries = entries.filter(e => e.id !== entryId);
    
    return this.saveModuleData('journal', { entries: filteredEntries });
  }

  // 花园相关存储
  saveGardenData(gardenData) {
    return this.saveModuleData('garden', gardenData);
  }

  getGardenData() {
    return this.getModuleData('garden');
  }

  // 冥想相关存储
  saveMeditationSession(session) {
    const meditationData = this.getModuleData('meditation');
    const sessions = meditationData?.sessions || [];
    
    sessions.push({
      ...session,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    });
    
    return this.saveModuleData('meditation', { sessions });
  }

  getMeditationSessions() {
    const meditationData = this.getModuleData('meditation');
    return meditationData?.sessions || [];
  }

  // 缓存管理
  setCache(key, data, expiry = this.cacheExpiry) {
    const allData = this.getAllLocalData();
    allData.cache[key] = {
      data,
      expiry: Date.now() + expiry,
      createdAt: new Date().toISOString(),
    };
    return this.saveAllData(allData);
  }

  getCache(key) {
    const allData = this.getAllLocalData();
    const cacheItem = allData.cache?.[key];
    
    if (!cacheItem) return null;
    
    // 检查是否过期
    if (Date.now() > cacheItem.expiry) {
      this.removeCache(key);
      return null;
    }
    
    return cacheItem.data;
  }

  removeCache(key) {
    const allData = this.getAllLocalData();
    if (allData.cache && allData.cache[key]) {
      delete allData.cache[key];
      this.saveAllData(allData);
    }
  }

  clearExpiredCache() {
    const allData = this.getAllLocalData();
    const now = Date.now();
    let hasExpired = false;
    
    Object.keys(allData.cache || {}).forEach(key => {
      if (allData.cache[key].expiry < now) {
        delete allData.cache[key];
        hasExpired = true;
      }
    });
    
    if (hasExpired) {
      this.saveAllData(allData);
    }
  }

  // 设置管理
  saveSettings(settings) {
    return this.saveModuleData('settings', settings);
  }

  getSettings() {
    return this.getModuleData('settings') || this.getDefaultData().settings;
  }

  // 数据同步标记
  markSynced(module) {
    return this.saveModuleData(module, { lastSync: new Date().toISOString() });
  }

  getSyncStatus(module) {
    const moduleData = this.getModuleData(module);
    return moduleData?.lastSync || null;
  }

  // 数据清理
  clearAllData() {
    if (!this.isStorageAvailable()) return false;
    
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('清理本地数据失败:', error);
      return false;
    }
  }

  clearModule(module) {
    const allData = this.getAllLocalData();
    allData[module] = this.getDefaultData()[module];
    return this.saveAllData(allData);
  }

  // 获取存储统计信息
  getStorageStats() {
    if (!this.isStorageAvailable()) return null;
    
    try {
      const data = localStorage.getItem(this.storageKey);
      const dataSize = data ? new Blob([data]).size : 0;
      const allData = this.getAllLocalData();
      
      return {
        totalSize: dataSize,
        humanReadableSize: this.formatBytes(dataSize),
        journalEntries: allData.journal?.entries?.length || 0,
        meditationSessions: allData.meditation?.sessions?.length || 0,
        cacheItems: Object.keys(allData.cache || {}).length,
        lastUpdated: allData.lastUpdated,
      };
    } catch (error) {
      console.error('获取存储统计失败:', error);
      return null;
    }
  }

  // 格式化字节数
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // 导出数据
  exportData() {
    const data = this.getAllLocalData();
    const exportData = {
      ...data,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // 导入数据
  importData(jsonData) {
    try {
      const data = JSON.parse(jsonData);
      // 验证数据结构
      if (data.version && data.exportDate) {
        return this.saveAllData(data);
      }
      throw new Error('无效的数据格式');
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}

// 创建单例实例
const storageService = new StorageService();

export default storageService;
