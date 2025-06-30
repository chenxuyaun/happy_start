// 用户工具函数

export const userUtils = {
  // 生成头像URL
  generateAvatarUrl: (name, options = {}) => {
    const {
      size = 100,
      background = 'random',
      color = 'fff',
      rounded = true,
    } = options;
    
    const initials = name ? name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : 'U';
    const params = new URLSearchParams({
      name: initials,
      background,
      color,
      size: size.toString(),
      rounded: rounded.toString(),
    });
    
    return `https://ui-avatars.com/api/?${params.toString()}`;
  },

  // 格式化用户显示名称
  getDisplayName: (user) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) {
      return user.firstName;
    }
    if (user.username) {
      return user.username;
    }
    return '用户';
  },

  // 计算用户年龄
  calculateAge: (dateOfBirth) => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  },

  // 验证邮箱格式
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // 验证电话号码格式
  validatePhone: (phone) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  },

  // 密码强度检查
  checkPasswordStrength: (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    
    const score = Object.values(checks).filter(Boolean).length;
    
    let strength = 'weak';
    if (score >= 4) strength = 'strong';
    else if (score >= 3) strength = 'medium';
    
    return { strength, checks, score };
  },

  // 格式化加入时间
  formatJoinDate: (joinDate) => {
    if (!joinDate) return '';
    
    const date = new Date(joinDate);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // 计算用户活跃度
  calculateActivityLevel: (stats) => {
    const {
      journalEntries = 0,
      meditationSessions = 0,
      gardenActivities = 0,
      daysActive = 0
    } = stats;
    
    const totalActivities = journalEntries + meditationSessions + gardenActivities;
    const avgActivitiesPerDay = daysActive > 0 ? totalActivities / daysActive : 0;
    
    if (avgActivitiesPerDay >= 3) return { level: 'high', label: '非常活跃' };
    if (avgActivitiesPerDay >= 1.5) return { level: 'medium', label: '比较活跃' };
    if (avgActivitiesPerDay >= 0.5) return { level: 'low', label: '偶尔活跃' };
    return { level: 'inactive', label: '不太活跃' };
  },

  // 获取用户徽章
  getUserBadges: (user, stats) => {
    const badges = [];
    
    // 基于注册时间的徽章
    const joinDate = new Date(user.joinedAt);
    const daysSinceJoin = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceJoin >= 365) {
      badges.push({ id: 'veteran', name: '老用户', icon: '🎖️', description: '使用超过一年' });
    } else if (daysSinceJoin >= 100) {
      badges.push({ id: 'active', name: '活跃用户', icon: '⭐', description: '使用超过100天' });
    } else if (daysSinceJoin >= 30) {
      badges.push({ id: 'regular', name: '常规用户', icon: '👤', description: '使用超过30天' });
    }
    
    // 基于活动的徽章
    if (stats?.journalEntries >= 100) {
      badges.push({ id: 'writer', name: '写作达人', icon: '✍️', description: '写了100篇日志' });
    }
    
    if (stats?.meditationSessions >= 50) {
      badges.push({ id: 'meditator', name: '冥想大师', icon: '🧘', description: '完成50次冥想' });
    }
    
    if (stats?.gardenActivities >= 30) {
      badges.push({ id: 'gardener', name: '园艺师', icon: '🌱', description: '进行30次园艺活动' });
    }
    
    return badges;
  },

  // 生成个性化问候语
  getPersonalizedGreeting: (user) => {
    const hour = new Date().getHours();
    const name = userUtils.getDisplayName(user);
    
    let timeGreeting = '';
    if (hour < 6) timeGreeting = '深夜好';
    else if (hour < 9) timeGreeting = '早上好';
    else if (hour < 12) timeGreeting = '上午好';
    else if (hour < 14) timeGreeting = '中午好';
    else if (hour < 18) timeGreeting = '下午好';
    else if (hour < 22) timeGreeting = '晚上好';
    else timeGreeting = '夜晚好';
    
    return `${timeGreeting}，${name}！`;
  },

  // 检查用户资料完整度
  checkProfileCompleteness: (user) => {
    const fields = [
      'username', 'email', 'firstName', 'lastName', 
      'bio', 'dateOfBirth', 'gender', 'location', 'phone'
    ];
    
    const completedFields = fields.filter(field => 
      user[field] && user[field].toString().trim() !== ''
    );
    
    const percentage = Math.round((completedFields.length / fields.length) * 100);
    
    const missing = fields.filter(field => 
      !user[field] || user[field].toString().trim() === ''
    );
    
    return {
      percentage,
      completedFields: completedFields.length,
      totalFields: fields.length,
      missing,
      isComplete: percentage === 100
    };
  },

  // 生成用户统计摘要
  generateUserSummary: (user, stats) => {
    const age = userUtils.calculateAge(user.dateOfBirth);
    const joinDays = Math.floor((new Date() - new Date(user.joinedAt)) / (1000 * 60 * 60 * 24));
    const activity = userUtils.calculateActivityLevel(stats);
    const completion = userUtils.checkProfileCompleteness(user);
    
    return {
      basicInfo: {
        name: userUtils.getDisplayName(user),
        age: age ? `${age}岁` : '未设置',
        location: user.location || '未设置',
        joinDays: `加入${joinDays}天`
      },
      activity: activity.label,
      profileCompletion: `${completion.percentage}%`,
      badges: userUtils.getUserBadges(user, stats).length
    };
  }
};

export default userUtils;
