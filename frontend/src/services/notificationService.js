import storageService from './storageService';

// 通知和提醒服务
class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.isSupported ? Notification.permission : 'denied';
    this.timers = new Map(); // 存储定时器
    this.serviceWorkerRegistration = null;
    
    // 初始化
    this.init();
  }

  // 初始化服务
  async init() {
    // 清理过期的缓存
    storageService.clearExpiredCache();
    
    // 注册Service Worker (如果需要)
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        console.log('Service Worker 注册失败:', error);
      }
    }
    
    // 恢复已设置的提醒
    this.restoreReminders();
  }

  // 请求通知权限
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('此浏览器不支持通知功能');
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('请求通知权限失败:', error);
      return false;
    }
  }

  // 检查通知权限
  hasPermission() {
    return this.isSupported && this.permission === 'granted';
  }

  // 显示即时通知
  showNotification(title, options = {}) {
    if (!this.hasPermission()) {
      console.warn('没有通知权限或不支持通知');
      return null;
    }

    const defaultOptions = {
      icon: '/icon-192x192.png',
      badge: '/icon-96x96.png',
      dir: 'auto',
      lang: 'zh-CN',
      renotify: false,
      requireInteraction: false,
      silent: false,
      tag: 'happyday-notification',
      vibrate: [200, 100, 200],
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // 添加点击事件
      notification.onclick = () => {
        window.focus();
        if (options.onClick) {
          options.onClick();
        }
        notification.close();
      };
      
      // 自动关闭
      if (options.autoClose !== false) {
        setTimeout(() => {
          notification.close();
        }, options.duration || 5000);
      }
      
      return notification;
    } catch (error) {
      console.error('显示通知失败:', error);
      return null;
    }
  }

  // 设置定时提醒
  scheduleReminder(type, time, options = {}) {
    const reminderKey = `${type}_${Date.now()}`;
    const targetTime = new Date(time);
    const now = new Date();
    
    if (targetTime <= now) {
      console.warn('提醒时间不能设置为过去的时间');
      return null;
    }
    
    const delay = targetTime.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      this.triggerReminder(type, options);
      this.timers.delete(reminderKey);
    }, delay);
    
    this.timers.set(reminderKey, {
      timer,
      type,
      time: targetTime,
      options
    });
    
    // 保存到本地存储
    this.saveReminder(reminderKey, type, targetTime, options);
    
    return reminderKey;
  }

  // 设置每日提醒
  setDailyReminder(type, time, options = {}) {
    const settings = storageService.getSettings();
    const reminderSettings = settings.notifications || {};
    
    // 清除之前的提醒
    this.clearDailyReminder(type);
    
    const reminderKey = `daily_${type}`;
    reminderSettings[`${type}Reminder`] = true;
    reminderSettings[`${type}Time`] = time;
    
    // 保存设置
    storageService.saveSettings({ notifications: reminderSettings });
    
    // 设置下一次提醒
    this.scheduleNextDailyReminder(type, time, options);
    
    return reminderKey;
  }

  // 设置下一次每日提醒
  scheduleNextDailyReminder(type, time, options = {}) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const targetTime = new Date(now);
    
    targetTime.setHours(hours, minutes, 0, 0);
    
    // 如果今天的时间已过，设置为明天
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
    
    const reminderKey = this.scheduleReminder(type, targetTime, {
      ...options,
      isDaily: true,
      originalTime: time
    });
    
    return reminderKey;
  }

  // 触发提醒
  triggerReminder(type, options = {}) {
    const reminderConfigs = {
      journal: {
        title: '📝 日记提醒',
        body: '该写今天的日记了！记录下美好的一天吧~',
        onClick: () => {
          window.location.hash = '/journal';
        }
      },
      meditation: {
        title: '🧘 冥想提醒',
        body: '是时候冥想一下，让心灵得到平静~',
        onClick: () => {
          window.location.hash = '/meditation';
        }
      },
      watering: {
        title: '🌱 浇水提醒',
        body: '别忘了给你的小花园浇水哦！',
        onClick: () => {
          window.location.hash = '/garden';
        }
      }
    };
    
    const config = reminderConfigs[type] || {};
    const mergedConfig = { ...config, ...options };
    
    this.showNotification(mergedConfig.title, {
      body: mergedConfig.body,
      onClick: mergedConfig.onClick,
      tag: `reminder-${type}`,
      ...mergedConfig
    });
    
    // 如果是每日提醒，设置下一次
    if (options.isDaily && options.originalTime) {
      setTimeout(() => {
        this.scheduleNextDailyReminder(type, options.originalTime, options);
      }, 1000);
    }
  }

  // 清除提醒
  clearReminder(reminderKey) {
    const reminder = this.timers.get(reminderKey);
    if (reminder) {
      clearTimeout(reminder.timer);
      this.timers.delete(reminderKey);
      
      // 从本地存储删除
      this.removeReminder(reminderKey);
      return true;
    }
    return false;
  }

  // 清除每日提醒
  clearDailyReminder(type) {
    // 清除当前设置的提醒
    const keysToRemove = [];
    this.timers.forEach((reminder, key) => {
      if (reminder.type === type && reminder.options.isDaily) {
        clearTimeout(reminder.timer);
        keysToRemove.push(key);
      }
    });
    
    keysToRemove.forEach(key => {
      this.timers.delete(key);
      this.removeReminder(key);
    });
    
    // 更新设置
    const settings = storageService.getSettings();
    const reminderSettings = settings.notifications || {};
    reminderSettings[`${type}Reminder`] = false;
    storageService.saveSettings({ notifications: reminderSettings });
  }

  // 清除所有提醒
  clearAllReminders() {
    this.timers.forEach((reminder, key) => {
      clearTimeout(reminder.timer);
    });
    this.timers.clear();
    
    // 清除本地存储
    storageService.removeCache('reminders');
  }

  // 获取活跃的提醒
  getActiveReminders() {
    const reminders = [];
    this.timers.forEach((reminder, key) => {
      reminders.push({
        key,
        type: reminder.type,
        time: reminder.time,
        options: reminder.options
      });
    });
    return reminders;
  }

  // 保存提醒到本地存储
  saveReminder(key, type, time, options) {
    const reminders = storageService.getCache('reminders') || {};
    reminders[key] = {
      type,
      time: time.toISOString(),
      options
    };
    storageService.setCache('reminders', reminders, 30 * 24 * 60 * 60 * 1000); // 30天过期
  }

  // 从本地存储删除提醒
  removeReminder(key) {
    const reminders = storageService.getCache('reminders') || {};
    delete reminders[key];
    storageService.setCache('reminders', reminders, 30 * 24 * 60 * 60 * 1000);
  }

  // 恢复已保存的提醒
  restoreReminders() {
    const reminders = storageService.getCache('reminders') || {};
    const now = new Date();
    
    Object.entries(reminders).forEach(([key, reminder]) => {
      const targetTime = new Date(reminder.time);
      
      // 只恢复未来的提醒
      if (targetTime > now) {
        const delay = targetTime.getTime() - now.getTime();
        
        const timer = setTimeout(() => {
          this.triggerReminder(reminder.type, reminder.options);
          this.timers.delete(key);
        }, delay);
        
        this.timers.set(key, {
          timer,
          type: reminder.type,
          time: targetTime,
          options: reminder.options
        });
      } else {
        // 清除过期的提醒
        this.removeReminder(key);
      }
    });
  }

  // 获取提醒设置
  getReminderSettings() {
    const settings = storageService.getSettings();
    return settings.notifications || {
      journalReminder: false,
      journalTime: '20:00',
      meditationReminder: false,
      meditationTime: '09:00',
      wateringReminder: false,
      wateringTime: '18:00',
    };
  }

  // 更新提醒设置
  updateReminderSettings(newSettings) {
    const currentSettings = this.getReminderSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    // 保存设置
    storageService.saveSettings({ notifications: updatedSettings });
    
    // 重新设置提醒
    Object.keys(newSettings).forEach(key => {
      if (key.endsWith('Reminder')) {
        const type = key.replace('Reminder', '');
        const isEnabled = newSettings[key];
        const timeKey = `${type}Time`;
        const time = updatedSettings[timeKey];
        
        if (isEnabled && time) {
          this.setDailyReminder(type, time);
        } else {
          this.clearDailyReminder(type);
        }
      }
    });
    
    return updatedSettings;
  }

  // 发送成就通知
  showAchievementNotification(achievement) {
    this.showNotification('🏆 恭喜获得新成就！', {
      body: achievement.description || achievement.name,
      icon: achievement.icon || '/achievement-icon.png',
      tag: 'achievement',
      requireInteraction: true,
      onClick: () => {
        window.location.hash = '/dashboard';
      }
    });
  }

  // 发送每日总结通知
  showDailySummaryNotification(summary) {
    const { journalCount, meditationMinutes, gardenActions } = summary;
    
    let body = '今日总结: ';
    const activities = [];
    
    if (journalCount > 0) activities.push(`写了 ${journalCount} 篇日记`);
    if (meditationMinutes > 0) activities.push(`冥想了 ${meditationMinutes} 分钟`);
    if (gardenActions > 0) activities.push(`花园活动 ${gardenActions} 次`);
    
    body += activities.length > 0 ? activities.join('，') : '今天还没有活动记录';
    
    this.showNotification('📊 每日总结', {
      body: body + '。继续保持！',
      tag: 'daily-summary',
      onClick: () => {
        window.location.hash = '/dashboard';
      }
    });
  }

  // 发送连续打卡通知
  showStreakNotification(streakType, days) {
    const streakMessages = {
      journal: `已连续写日记 ${days} 天！`,
      meditation: `已连续冥想 ${days} 天！`,
      garden: `已连续照料花园 ${days} 天！`
    };
    
    this.showNotification('🔥 连续打卡', {
      body: streakMessages[streakType] || `已连续 ${days} 天！`,
      tag: 'streak',
      requireInteraction: true
    });
  }

  // 测试通知
  testNotification() {
    this.showNotification('🎉 测试通知', {
      body: '如果你看到这条消息，说明通知功能正常工作！',
      tag: 'test',
      onClick: () => {
        console.log('测试通知被点击');
      }
    });
  }

  // 获取统计信息
  getStats() {
    return {
      isSupported: this.isSupported,
      hasPermission: this.hasPermission(),
      activeReminders: this.timers.size,
      reminderTypes: Array.from(new Set(
        Array.from(this.timers.values()).map(r => r.type)
      ))
    };
  }
}

// 创建单例实例
const notificationService = new NotificationService();

export default notificationService;
