import { journalService } from './journalService';
import { gardenService } from './gardenService';
import { meditationService } from './meditationService';

export const dashboardService = {
  // 获取控制台总览数据
  async getDashboardOverview() {
    try {
      // 并行获取各种统计数据
      const [journalStats, meditationStats, gardenState, emotionTrends] = await Promise.allSettled([
        journalService.getJournalStats(),
        meditationService.getMeditationStats(),
        gardenService.getGardenState(),
        journalService.getEmotionTrends({ period: '30d' })
      ]);

      return {
        success: true,
        data: {
          stats: {
            totalEntries: journalStats.status === 'fulfilled' ? journalStats.value?.totalEntries || 0 : 0,
            totalMeditations: meditationStats.status === 'fulfilled' ? meditationStats.value?.totalSessions || 0 : 0,
            plantsGrown: gardenState.status === 'fulfilled' ? gardenState.value?.plants?.length || 0 : 0,
            streakDays: journalStats.status === 'fulfilled' ? journalStats.value?.streakDays || 0 : 0,
            weeklyGoalProgress: journalStats.status === 'fulfilled' ? journalStats.value?.weeklyProgress || 0 : 0
          },
          emotionTrends: emotionTrends.status === 'fulfilled' ? emotionTrends.value || [] : [],
          journalStats: journalStats.status === 'fulfilled' ? journalStats.value : null,
          meditationStats: meditationStats.status === 'fulfilled' ? meditationStats.value : null,
          gardenState: gardenState.status === 'fulfilled' ? gardenState.value : null
        }
      };
    } catch (error) {
      console.error('获取控制台数据失败:', error);
      return {
        success: false,
        error: error.message || '获取数据失败'
      };
    }
  },

  // 获取最近活动
  async getRecentActivities(limit = 10) {
    try {
      const activities = [];
      
      // 获取最近的日记条目
      try {
        const recentJournals = await journalService.getJournalEntries({ 
          limit: 3, 
          sort: 'createdAt',
          order: 'desc' 
        });
        
        if (recentJournals?.entries) {
          recentJournals.entries.forEach(entry => {
            activities.push({
              id: `journal_${entry.id}`,
              type: 'journal',
              title: '记录了新的日记',
              description: entry.title || '今天的心情记录',
              timestamp: entry.createdAt,
              metadata: {
                emotion: entry.emotion,
                tags: entry.tags
              }
            });
          });
        }
      } catch (err) {
        console.warn('获取日记活动失败:', err);
      }

      // 获取最近的冥想记录
      try {
        const recentMeditations = await meditationService.getMeditationHistory({ 
          limit: 3,
          sort: 'completedAt',
          order: 'desc'
        });
        
        if (recentMeditations?.sessions) {
          recentMeditations.sessions.forEach(session => {
            activities.push({
              id: `meditation_${session.id}`,
              type: 'meditation',
              title: '完成了冥想练习',
              description: `${session.duration}分钟 ${session.type || '冥想'}`,
              timestamp: session.completedAt,
              metadata: {
                duration: session.duration,
                type: session.type,
                mood: session.endMood
              }
            });
          });
        }
      } catch (err) {
        console.warn('获取冥想活动失败:', err);
      }

      // 获取花园活动
      try {
        const gardenActivities = await gardenService.getGardenActivities({ 
          limit: 3,
          sort: 'timestamp',
          order: 'desc'
        });
        
        if (gardenActivities?.activities) {
          gardenActivities.activities.forEach(activity => {
            activities.push({
              id: `garden_${activity.id}`,
              type: 'garden',
              title: '花园活动',
              description: activity.description || activity.action,
              timestamp: activity.timestamp,
              metadata: {
                action: activity.action,
                plantName: activity.plantName
              }
            });
          });
        }
      } catch (err) {
        console.warn('获取花园活动失败:', err);
      }

      // 按时间排序并限制数量
      const sortedActivities = activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);

      return {
        success: true,
        data: sortedActivities
      };
    } catch (error) {
      console.error('获取最近活动失败:', error);
      return {
        success: false,
        error: error.message || '获取活动记录失败'
      };
    }
  },

  // 生成示例数据（用于开发和测试）
  generateMockData() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    
    // 生成30天的情绪数据
    const emotionTrends = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      emotionTrends.push({
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        happiness: Math.round((Math.random() * 3 + 2) * 10) / 10, // 2-5范围
        stress: Math.round((Math.random() * 3 + 1) * 10) / 10, // 1-4范围
        energy: Math.round((Math.random() * 4 + 1) * 10) / 10, // 1-5范围
      });
    }

    // 生成模拟活动
    const recentActivities = [
      {
        id: 'activity_1',
        type: 'journal',
        title: '记录了新的日记',
        description: '今天心情很好，工作顺利',
        timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
        metadata: { emotion: 'happy', tags: ['工作', '心情'] }
      },
      {
        id: 'activity_2',
        type: 'meditation',
        title: '完成了冥想练习',
        description: '15分钟 专注呼吸',
        timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5小时前
        metadata: { duration: 15, type: '专注呼吸' }
      },
      {
        id: 'activity_3',
        type: 'garden',
        title: '花园活动',
        description: '给玫瑰花浇了水',
        timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
        metadata: { action: '浇水', plantName: '玫瑰花' }
      },
      {
        id: 'activity_4',
        type: 'journal',
        title: '记录了新的日记',
        description: '今天学习了新技能',
        timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
        metadata: { emotion: 'excited', tags: ['学习', '成长'] }
      }
    ];

    return {
      success: true,
      data: {
        stats: {
          totalEntries: 23,
          totalMeditations: 15,
          plantsGrown: 8,
          streakDays: 7,
          weeklyGoalProgress: 75
        },
        emotionTrends,
        recentActivities,
        journalStats: {
          totalEntries: 23,
          streakDays: 7,
          averageMood: 4.2,
          topEmotions: ['happy', 'calm', 'excited'],
          weeklyProgress: 75
        },
        meditationStats: {
          totalSessions: 15,
          totalMinutes: 360,
          averageSession: 24,
          longestStreak: 5,
          favoriteType: '专注呼吸'
        },
        gardenState: {
          totalPlants: 8,
          healthyPlants: 7,
          needWater: 2,
          readyToHarvest: 1,
          coins: 125
        }
      }
    };
  }
};
