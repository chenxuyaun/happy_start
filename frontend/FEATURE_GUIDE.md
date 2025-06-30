# HappyDay 新功能使用指南

本文档详细介绍了HappyDay应用新增的5个重要功能：连接真实后端API、数据本地存储、导出功能、提醒功能和社交分享。

## 1. 连接真实后端API

### 功能概述
- 统一的API配置管理
- 支持多环境配置（开发、测试、生产）
- 自动token管理和刷新
- 完善的错误处理机制

### 配置文件
- 位置：`src/config/apiConfig.js`
- 包含所有服务端点配置
- 支持环境变量覆盖

### 使用方法
```javascript
import { API_CONFIG, buildApiUrl } from '../config/apiConfig';

// 获取API端点
const loginUrl = buildApiUrl(API_CONFIG.ENDPOINTS.USER.LOGIN);

// 使用API服务
import api from '../services/api';
const response = await api.post('/auth/login', { username, password });
```

### 环境配置
在`.env`文件中设置：
```bash
REACT_APP_API_URL=https://api.happyday.com
REACT_APP_WS_URL=wss://api.happyday.com
```

## 2. 数据本地存储

### 功能概述
- 完整的离线数据管理
- 自动缓存清理机制
- 数据同步状态跟踪
- 支持数据导入导出

### 服务位置
- 文件：`src/services/storageService.js`
- 单例模式，全局可用

### 主要功能

#### 保存数据
```javascript
import storageService from '../services/storageService';

// 保存日记条目
storageService.saveJournalEntry({
  id: '123',
  title: '今天的心情',
  content: '非常开心的一天',
  mood: 'happy',
  date: '2024-01-15'
});

// 保存冥想记录
storageService.saveMeditationSession({
  duration: 600, // 10分钟
  type: 'breathing',
  completed: true
});
```

#### 读取数据
```javascript
// 获取日记条目（支持过滤）
const entries = storageService.getJournalEntries({
  startDate: '2024-01-01',
  mood: 'happy'
});

// 获取存储统计
const stats = storageService.getStorageStats();
```

#### 缓存管理
```javascript
// 设置缓存
storageService.setCache('user_preferences', data, 3600000); // 1小时过期

// 获取缓存
const cached = storageService.getCache('user_preferences');

// 清理过期缓存
storageService.clearExpiredCache();
```

### 数据结构
```javascript
{
  user: null,
  journal: {
    entries: [],
    tags: [],
    lastSync: null
  },
  garden: {
    plants: [],
    achievements: [],
    wateringHistory: []
  },
  meditation: {
    sessions: [],
    progress: [],
    tracks: []
  },
  settings: {
    notifications: {...},
    theme: 'light',
    language: 'zh-CN'
  },
  cache: {}
}
```

## 3. 导出功能

### 功能概述
- 支持多种格式：JSON、CSV、TXT、PDF
- 分模块导出：日记、冥想、花园、全部数据
- 数据过滤和预览
- 自动文件下载

### 服务位置
- 文件：`src/services/exportService.js`

### 支持的导出格式

#### JSON格式
```javascript
import exportService from '../services/exportService';

// 导出所有数据为JSON
await exportService.exportAllData('json', { prettyPrint: true });

// 导出日记数据
await exportService.exportJournalData('json', {
  startDate: '2024-01-01',
  endDate: '2024-01-31'
});
```

#### CSV格式
```javascript
// 导出日记为CSV
await exportService.exportJournalData('csv');

// 导出冥想记录为CSV  
await exportService.exportMeditationData('csv');
```

#### 文本格式
```javascript
// 导出为可读文本格式
await exportService.exportJournalData('txt');
```

### 导出预览
```javascript
// 生成预览内容
const preview = exportService.generatePreview(data, 'csv', 5);
```

### 文件命名规则
- 格式：`{type}_export_{timestamp}.{extension}`
- 示例：`journal_export_2024-01-15_14-30-25.csv`

## 4. 提醒功能

### 功能概述
- 浏览器原生通知支持
- 定时和每日提醒
- 多种提醒类型：日记、冥想、浇水
- 成就和里程碑通知

### 服务位置
- 文件：`src/services/notificationService.js`

### 权限管理
```javascript
import notificationService from '../services/notificationService';

// 请求通知权限
const granted = await notificationService.requestPermission();

// 检查权限状态
const hasPermission = notificationService.hasPermission();
```

### 设置提醒

#### 即时通知
```javascript
// 显示即时通知
notificationService.showNotification('标题', {
  body: '通知内容',
  icon: '/icon.png',
  onClick: () => {
    // 点击处理
  }
});
```

#### 定时提醒
```javascript
// 设置单次提醒
const reminderId = notificationService.scheduleReminder(
  'journal', 
  new Date(Date.now() + 3600000), // 1小时后
  { message: '记得写日记哦！' }
);
```

#### 每日提醒
```javascript
// 设置每日提醒
notificationService.setDailyReminder('journal', '20:00', {
  title: '日记提醒',
  body: '该写今天的日记了！'
});

// 更新提醒设置
notificationService.updateReminderSettings({
  journalReminder: true,
  journalTime: '20:00',
  meditationReminder: true,
  meditationTime: '09:00'
});
```

### 特殊通知

#### 成就通知
```javascript
notificationService.showAchievementNotification({
  name: '连续写日记7天',
  description: '恭喜您坚持了一周！'
});
```

#### 连续打卡通知
```javascript
notificationService.showStreakNotification('journal', 7);
```

#### 每日总结
```javascript
notificationService.showDailySummaryNotification({
  journalCount: 1,
  meditationMinutes: 15,
  gardenActions: 3
});
```

### 提醒管理
```javascript
// 清除特定提醒
notificationService.clearReminder(reminderId);

// 清除所有提醒
notificationService.clearAllReminders();

// 获取活跃提醒
const activeReminders = notificationService.getActiveReminders();
```

## 5. 社交分享

### 功能概述
- 多平台分享：微信、微博、QQ空间、Twitter、Facebook等
- 分享模板系统
- 自动分享配置
- 分享历史记录

### 服务位置
- 文件：`src/services/socialService.js`

### 分享类型

#### 分享成就
```javascript
import socialService from '../services/socialService';

socialService.shareAchievement({
  name: '连续冥想7天',
  description: '保持内心平静的好习惯'
}, { platform: 'weibo' });
```

#### 分享进度
```javascript
socialService.shareProgress({
  totalDays: 30,
  journalCount: 25,
  meditationMinutes: 450,
  gardenLevel: 5
}, { platform: 'auto' }); // 显示选择对话框
```

#### 分享名言感悟
```javascript
socialService.shareQuote(
  '今天是美好的一天，充满了无限可能。',
  { platform: 'wechat' }
);
```

#### 分享日记
```javascript
socialService.shareJournal({
  mood: '开心',
  content: '今天去公园散步，看到了美丽的花朵...'
}, { platform: 'qzone' });
```

### 分享设置
```javascript
// 获取分享设置
const settings = socialService.getShareSettings();

// 更新设置
socialService.updateShareSettings({
  allowShare: true,
  platforms: {
    wechat: true,
    weibo: true,
    twitter: false
  },
  autoShare: {
    achievements: true,
    milestones: false
  }
});
```

### 支持的平台
- 微信 (wechat)
- 微博 (weibo)
- QQ空间 (qzone)
- Twitter (twitter)
- Facebook (facebook)
- LinkedIn (linkedin)
- 复制链接 (copy)

### 分享模板
模板支持变量替换：
```javascript
{
  achievement: {
    title: '🏆 在HappyDay获得了新成就！',
    content: '我在HappyDay应用中获得了"{achievementName}"成就！{description}'
  }
}
```

### 分享统计
```javascript
// 获取分享统计
const stats = socialService.generateShareStats();

// 清除分享历史
socialService.clearShareHistory();
```

## 使用设置页面

### 页面位置
- 文件：`src/pages/SettingsPage.js`
- 路由：`/settings`

### 功能模块
1. **通用设置**：主题、语言等基础配置
2. **通知提醒**：各种提醒的开关和时间设置
3. **数据管理**：存储统计、导出和清理功能
4. **社交分享**：分享平台和自动分享设置

### 使用方法
在应用路由中添加设置页面：
```javascript
import SettingsPage from './pages/SettingsPage';

// 在路由配置中添加
<Route path="/settings" element={<SettingsPage />} />
```

## 最佳实践

### 1. 数据管理
- 定期清理过期缓存
- 及时备份重要数据
- 监控存储使用情况

### 2. 通知设置
- 合理设置提醒时间
- 避免过多通知干扰
- 测试通知权限状态

### 3. 分享功能
- 尊重用户隐私设置
- 提供分享预览功能
- 记录分享统计数据

### 4. API集成
- 处理网络异常情况
- 实现数据同步机制
- 保持本地缓存更新

## 故障排除

### 常见问题

1. **通知不显示**
   - 检查浏览器通知权限
   - 确认通知服务是否启用
   - 查看控制台错误信息

2. **数据导出失败**
   - 检查浏览器下载权限
   - 确认数据格式是否支持
   - 查看存储空间是否足够

3. **分享功能异常**
   - 检查网络连接状态
   - 确认分享平台设置
   - 验证分享内容格式

4. **API连接失败**
   - 检查网络连接
   - 验证API端点配置
   - 查看认证token状态

通过以上功能，HappyDay应用将提供更完整和丰富的用户体验，支持离线使用、数据备份、智能提醒和社交分享等现代应用必备功能。
