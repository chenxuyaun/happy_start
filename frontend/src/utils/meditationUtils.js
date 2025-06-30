// 冥想工具函数

export const meditationUtils = {
  // 格式化时间显示（秒转为 mm:ss 格式）
  formatTime: (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },

  // 格式化持续时间显示（分钟转为易读格式）
  formatDuration: (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}小时${mins}分钟`;
    }
    return `${mins}分钟`;
  },

  // 计算冥想类型的颜色
  getCategoryColor: (category) => {
    const colors = {
      '基础冥想': '#4CAF50',
      '正念冥想': '#2196F3', 
      '放松冥想': '#9C27B0',
      '睡眠冥想': '#3F51B5',
      '慈悲冥想': '#FF9800',
      '专注训练': '#F44336',
    };
    return colors[category] || '#9E9E9E';
  },

  // 根据难度级别获取颜色
  getLevelColor: (level) => {
    switch (level) {
      case '初级': return 'success';
      case '中级': return 'warning';
      case '高级': return 'error';
      default: return 'default';
    }
  },

  // 计算连续天数的等级
  getStreakLevel: (streak) => {
    if (streak >= 30) return { level: '大师', color: 'error' };
    if (streak >= 14) return { level: '进阶', color: 'warning' };
    if (streak >= 7) return { level: '坚持', color: 'success' };
    if (streak >= 3) return { level: '新手', color: 'info' };
    return { level: '开始', color: 'primary' };
  },

  // 生成随机冥想建议
  getRandomTip: () => {
    const tips = [
      '专注于呼吸，让思绪自然流淌',
      '找一个安静的环境，保持舒适的坐姿',
      '不要强迫自己不去想事情，接受一切念头',
      '从短时间开始，逐渐增加冥想时长',
      '每天定时冥想，培养良好的习惯',
      '冥想时保持脊椎挺直，但不要紧张',
      '如果分心了，温和地将注意力拉回呼吸',
      '冥想是练习，不是表现，不要对自己太苛刻',
      '尝试不同类型的冥想，找到适合自己的方式',
      '冥想后花一点时间感受身心的变化'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  },

  // 根据一天中的时间推荐冥想类型
  getTimeBasedRecommendation: () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 9) {
      return {
        type: '晨间冥想',
        description: '用正念冥想开始新的一天，提升注意力和积极性',
        duration: 10
      };
    } else if (hour >= 12 && hour < 14) {
      return {
        type: '午间放松',
        description: '短暂的放松冥想，恢复精力迎接下午的工作',
        duration: 5
      };
    } else if (hour >= 18 && hour < 21) {
      return {
        type: '晚间减压',
        description: '释放一天的压力和紧张，让身心得到放松',
        duration: 15
      };
    } else if (hour >= 21 || hour < 6) {
      return {
        type: '睡前冥想',
        description: '温和的冥想练习，帮助您放松身心准备睡眠',
        duration: 12
      };
    }
    
    return {
      type: '自由冥想',
      description: '选择您喜欢的冥想方式，享受内心的宁静',
      duration: 10
    };
  },

  // 计算冥想效果评级
  calculateEffectivenessRating: (duration, consistency, totalSessions) => {
    let score = 0;
    
    // 基于时长评分 (0-30分)
    if (duration >= 20) score += 30;
    else if (duration >= 15) score += 25;
    else if (duration >= 10) score += 20;
    else if (duration >= 5) score += 15;
    else score += 10;
    
    // 基于连续性评分 (0-40分)
    if (consistency >= 30) score += 40;
    else if (consistency >= 14) score += 35;
    else if (consistency >= 7) score += 30;
    else if (consistency >= 3) score += 20;
    else score += 10;
    
    // 基于总次数评分 (0-30分)
    if (totalSessions >= 100) score += 30;
    else if (totalSessions >= 50) score += 25;
    else if (totalSessions >= 20) score += 20;
    else if (totalSessions >= 10) score += 15;
    else score += 10;
    
    return Math.min(score, 100);
  },

  // 生成个性化建议
  getPersonalizedAdvice: (stats) => {
    const { totalSessions, totalMinutes, streak } = stats;
    const avgDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;
    
    const advice = [];
    
    if (totalSessions < 10) {
      advice.push('坚持练习！前10次冥想是建立习惯的关键');
    }
    
    if (avgDuration < 10) {
      advice.push('尝试逐渐增加冥想时长，10-15分钟是很好的目标');
    }
    
    if (streak < 7) {
      advice.push('尝试建立每日冥想习惯，连续7天会有显著效果');
    }
    
    if (streak >= 7 && avgDuration >= 15) {
      advice.push('很棒！您已经建立了良好的冥想习惯');
    }
    
    if (totalSessions >= 30) {
      advice.push('考虑尝试更高级的冥想技巧，如观想或慈悲冥想');
    }
    
    return advice.length > 0 ? advice : ['继续保持您的冥想练习！'];
  },

  // 检查是否达成成就
  checkAchievements: (stats) => {
    const achievements = [];
    
    if (stats.totalSessions >= 1) {
      achievements.push({
        id: 'first_meditation',
        name: '初次冥想',
        description: '完成第一次冥想',
        icon: '🧘'
      });
    }
    
    if (stats.streak >= 7) {
      achievements.push({
        id: 'week_streak',
        name: '连续一周',
        description: '连续冥想7天',
        icon: '🔥'
      });
    }
    
    if (stats.totalSessions >= 50) {
      achievements.push({
        id: 'meditation_master',
        name: '冥想达人',
        description: '总计冥想50次',
        icon: '🏆'
      });
    }
    
    if (stats.totalMinutes >= 600) { // 10小时
      achievements.push({
        id: 'time_master',
        name: '时间大师',
        description: '累计冥想10小时',
        icon: '⏰'
      });
    }
    
    return achievements;
  }
};

export default meditationUtils;
