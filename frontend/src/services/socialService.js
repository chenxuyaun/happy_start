import storageService from './storageService';

// 社交分享服务
class SocialService {
  constructor() {
    this.supportedPlatforms = [
      'wechat',
      'weibo',
      'qzone',
      'twitter',
      'facebook',
      'linkedin',
      'copy'
    ];
    
    this.shareTemplates = {
      achievement: {
        title: '🏆 在HappyDay获得了新成就！',
        content: '我在HappyDay应用中获得了"{achievementName}"成就！{description}\n\n一起来记录美好生活吧~ #HappyDay #正能量'
      },
      progress: {
        title: '📈 我的成长进步',
        content: '我在HappyDay已经坚持了{days}天！\n📝 写了{journalCount}篇日记\n🧘 冥想了{meditationMinutes}分钟\n🌱 花园等级{gardenLevel}\n\n每天都在进步~ #HappyDay #自我成长'
      },
      quote: {
        title: '💭 今日感悟',
        content: '"{quote}"\n\n在HappyDay记录生活的美好瞬间 #HappyDay #生活感悟'
      },
      journal: {
        title: '📖 今日日记分享',
        content: '今天的心情：{mood}\n\n{content}\n\n记录生活，发现美好~ #HappyDay #日记'
      }
    };
  }

  // 获取分享设置
  getShareSettings() {
    const settings = storageService.getSettings();
    return settings.social || {
      allowShare: true,
      defaultPrivacy: 'private', // private, friends, public
      platforms: {
        wechat: true,
        weibo: true,
        qzone: false,
        twitter: false,
        facebook: false,
        linkedin: false
      },
      autoShare: {
        achievements: false,
        milestones: false,
        streaks: false
      }
    };
  }

  // 更新分享设置
  updateShareSettings(newSettings) {
    const currentSettings = this.getShareSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    storageService.saveSettings({ social: updatedSettings });
    return updatedSettings;
  }

  // 生成分享内容
  generateShareContent(type, data) {
    const template = this.shareTemplates[type];
    if (!template) {
      throw new Error(`不支持的分享类型: ${type}`);
    }

    let content = template.content;
    
    // 替换模板变量
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`;
      content = content.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });

    return {
      title: template.title,
      content: content,
      url: window.location.origin,
      image: data.image || '/share-default.png'
    };
  }

  // 分享成就
  shareAchievement(achievement, options = {}) {
    const shareData = this.generateShareContent('achievement', {
      achievementName: achievement.name,
      description: achievement.description || '',
      ...options
    });

    return this.share(shareData, options.platform);
  }

  // 分享进度
  shareProgress(progressData, options = {}) {
    const shareData = this.generateShareContent('progress', {
      days: progressData.totalDays || 0,
      journalCount: progressData.journalCount || 0,
      meditationMinutes: progressData.meditationMinutes || 0,
      gardenLevel: progressData.gardenLevel || 1,
      ...options
    });

    return this.share(shareData, options.platform);
  }

  // 分享名言或感悟
  shareQuote(quote, options = {}) {
    const shareData = this.generateShareContent('quote', {
      quote: quote,
      ...options
    });

    return this.share(shareData, options.platform);
  }

  // 分享日记
  shareJournal(journal, options = {}) {
    const shareData = this.generateShareContent('journal', {
      mood: journal.mood || '愉快',
      content: this.truncateText(journal.content || '', 100),
      ...options
    });

    return this.share(shareData, options.platform);
  }

  // 执行分享
  async share(shareData, platform = 'auto') {
    const settings = this.getShareSettings();
    
    if (!settings.allowShare) {
      throw new Error('分享功能已禁用');
    }

    if (platform === 'auto') {
      return this.showShareDialog(shareData);
    }

    return this.shareToSpecificPlatform(shareData, platform);
  }

  // 显示分享对话框
  showShareDialog(shareData) {
    return new Promise((resolve, reject) => {
      // 创建分享对话框
      const dialog = this.createShareDialog(shareData);
      
      document.body.appendChild(dialog);
      
      // 绑定事件
      dialog.addEventListener('click', (e) => {
        const platform = e.target.dataset.platform;
        if (platform) {
          this.shareToSpecificPlatform(shareData, platform)
            .then(resolve)
            .catch(reject);
          document.body.removeChild(dialog);
        }
      });

      // 点击背景关闭
      dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
          document.body.removeChild(dialog);
          reject(new Error('用户取消分享'));
        }
      });
    });
  }

  // 创建分享对话框
  createShareDialog(shareData) {
    const dialog = document.createElement('div');
    dialog.className = 'share-dialog-overlay';
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    const content = document.createElement('div');
    content.className = 'share-dialog-content';
    content.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    `;

    const title = document.createElement('h3');
    title.textContent = '分享到';
    title.style.cssText = 'margin: 0 0 16px 0; text-align: center;';

    const preview = document.createElement('div');
    preview.style.cssText = `
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 1.5;
    `;
    preview.textContent = shareData.content.substring(0, 100) + '...';

    const platformGrid = document.createElement('div');
    platformGrid.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    `;

    const platforms = [
      { key: 'wechat', name: '微信', icon: '💬' },
      { key: 'weibo', name: '微博', icon: '🐦' },
      { key: 'qzone', name: 'QQ空间', icon: '🎯' },
      { key: 'copy', name: '复制链接', icon: '📋' },
      { key: 'twitter', name: 'Twitter', icon: '🐥' },
      { key: 'facebook', name: 'Facebook', icon: '📘' }
    ];

    platforms.forEach(platform => {
      const button = document.createElement('button');
      button.dataset.platform = platform.key;
      button.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background: white;
        cursor: pointer;
        transition: background 0.2s;
      `;
      button.innerHTML = `
        <span style="font-size: 24px; margin-bottom: 4px;">${platform.icon}</span>
        <span style="font-size: 12px;">${platform.name}</span>
      `;
      
      button.addEventListener('mouseenter', () => {
        button.style.background = '#f0f0f0';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.background = 'white';
      });

      platformGrid.appendChild(button);
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.cssText = `
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
    `;
    
    cancelButton.addEventListener('click', () => {
      document.body.removeChild(dialog);
    });

    content.appendChild(title);
    content.appendChild(preview);
    content.appendChild(platformGrid);
    content.appendChild(cancelButton);
    dialog.appendChild(content);

    return dialog;
  }

  // 分享到特定平台
  async shareToSpecificPlatform(shareData, platform) {
    const settings = this.getShareSettings();
    
    if (!settings.platforms[platform] && platform !== 'copy') {
      throw new Error(`平台 ${platform} 未启用`);
    }

    const shareUrl = this.buildShareUrl(platform, shareData);
    
    switch (platform) {
      case 'copy':
        return this.copyToClipboard(shareData);
      
      case 'wechat':
        return this.shareToWechat(shareData);
      
      default:
        // 其他平台通过打开新窗口分享
        window.open(shareUrl, '_blank', 'width=600,height=400');
        return { success: true, platform, method: 'popup' };
    }
  }

  // 构建分享链接
  buildShareUrl(platform, shareData) {
    const encodedText = encodeURIComponent(shareData.content);
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedTitle = encodeURIComponent(shareData.title);

    const urls = {
      weibo: `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedText}`,
      qzone: `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${encodedUrl}&title=${encodedTitle}&desc=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`
    };

    return urls[platform] || '';
  }

  // 复制到剪贴板
  async copyToClipboard(shareData) {
    try {
      const textToCopy = `${shareData.title}\n\n${shareData.content}\n\n${shareData.url}`;
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      return { success: true, platform: 'copy', method: 'clipboard' };
    } catch (error) {
      throw new Error('复制到剪贴板失败');
    }
  }

  // 分享到微信（通过二维码）
  shareToWechat(shareData) {
    // 这里可以集成微信SDK或生成分享二维码
    // 现在简化为复制链接
    return this.copyToClipboard(shareData);
  }

  // 截断文本
  truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  }

  // 生成分享统计
  generateShareStats() {
    const settings = this.getShareSettings();
    const shareHistory = storageService.getCache('shareHistory') || [];
    
    const stats = {
      totalShares: shareHistory.length,
      platformStats: {},
      recentShares: shareHistory.slice(-10),
      settings: settings
    };

    // 统计各平台分享次数
    shareHistory.forEach(share => {
      const platform = share.platform || 'unknown';
      stats.platformStats[platform] = (stats.platformStats[platform] || 0) + 1;
    });

    return stats;
  }

  // 记录分享历史
  recordShare(shareData, platform, result) {
    const shareHistory = storageService.getCache('shareHistory') || [];
    
    const shareRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      platform: platform,
      type: shareData.type || 'unknown',
      title: shareData.title,
      success: result.success,
      method: result.method || 'unknown'
    };

    shareHistory.push(shareRecord);
    
    // 只保留最近100条记录
    if (shareHistory.length > 100) {
      shareHistory.splice(0, shareHistory.length - 100);
    }

    storageService.setCache('shareHistory', shareHistory, 90 * 24 * 60 * 60 * 1000); // 90天过期
  }

  // 自动分享检查
  checkAutoShare(type, data) {
    const settings = this.getShareSettings();
    
    if (!settings.autoShare[type]) {
      return false;
    }

    // 根据类型自动分享
    switch (type) {
      case 'achievements':
        this.shareAchievement(data, { platform: 'auto' });
        break;
      case 'milestones':
        this.shareProgress(data, { platform: 'auto' });
        break;
      case 'streaks':
        this.shareProgress(data, { platform: 'auto' });
        break;
    }

    return true;
  }

  // 获取支持的平台列表
  getSupportedPlatforms() {
    return this.supportedPlatforms.map(platform => ({
      key: platform,
      name: this.getPlatformName(platform),
      icon: this.getPlatformIcon(platform)
    }));
  }

  // 获取平台名称
  getPlatformName(platform) {
    const names = {
      wechat: '微信',
      weibo: '微博',
      qzone: 'QQ空间',
      twitter: 'Twitter',
      facebook: 'Facebook',
      linkedin: 'LinkedIn',
      copy: '复制链接'
    };
    return names[platform] || platform;
  }

  // 获取平台图标
  getPlatformIcon(platform) {
    const icons = {
      wechat: '💬',
      weibo: '🐦',
      qzone: '🎯',
      twitter: '🐥',
      facebook: '📘',
      linkedin: '💼',
      copy: '📋'
    };
    return icons[platform] || '🔗';
  }

  // 清除分享历史
  clearShareHistory() {
    storageService.removeCache('shareHistory');
    return true;
  }

  // 导出分享数据
  exportShareData() {
    const stats = this.generateShareStats();
    const settings = this.getShareSettings();
    
    return {
      stats,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }
}

// 创建单例实例
const socialService = new SocialService();

export default socialService;
