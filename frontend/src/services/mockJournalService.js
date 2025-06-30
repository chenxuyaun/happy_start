// 模拟日记数据服务
export const mockJournalService = {
  // 生成模拟日记数据
  generateMockJournals() {
    const journals = [];
    const emotions = ['very_happy', 'happy', 'neutral', 'sad', 'very_sad'];
    const tags = ['工作', '学习', '运动', '朋友', '家庭', '旅行', '读书', '电影', '美食', '音乐'];
    
    // 生成最近30天的日记
    for (let i = 0; i < 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const selectedTags = tags.slice(0, Math.floor(Math.random() * 4) + 1);
      
      journals.push({
        id: `mock_journal_${i + 1}`,
        title: this.generateTitle(emotion, i),
        content: this.generateContent(emotion, i),
        emotion: emotion,
        mood: Math.floor(Math.random() * 5) + 1,
        stress: Math.floor(Math.random() * 5) + 1,
        energy: Math.floor(Math.random() * 5) + 1,
        tags: selectedTags,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString()
      });
    }
    
    return journals.reverse(); // 最新的在前面
  },

  generateTitle(emotion, index) {
    const titles = {
      very_happy: [
        '今天特别开心！',
        '美好的一天',
        '收获满满的日子',
        '幸福时刻',
        '心情大好'
      ],
      happy: [
        '愉快的一天',
        '今天心情不错',
        '小确幸的一天',
        '开心的事情',
        '轻松愉快'
      ],
      neutral: [
        '平凡的一天',
        '日常记录',
        '今天的想法',
        '普通的日子',
        '随笔'
      ],
      sad: [
        '有些难过',
        '今天不太好',
        '心情低落',
        '需要调整心态',
        '情绪波动'
      ],
      very_sad: [
        '很难过的一天',
        '心情很糟糕',
        '需要发泄一下',
        '痛苦的记录',
        '低谷期'
      ]
    };
    
    const emotionTitles = titles[emotion] || titles.neutral;
    return emotionTitles[index % emotionTitles.length];
  },

  generateContent(emotion, index) {
    const contents = {
      very_happy: [
        '今天发生了很多好事情！工作上得到了同事的认可，下班后还和朋友们聚餐，感觉生活真是美好。心情特别棒，希望这种状态能一直保持下去。',
        '收到了期待已久的好消息，整个人都兴奋起来了。这段时间的努力终于有了回报，感觉一切都在朝着好的方向发展。',
        '和家人度过了温馨的时光，聊天、看电影、一起做饭，这些简单的事情让我感到特别幸福。有时候快乐就是这么简单。',
        '完成了一个重要的项目，获得了很好的反馈。这种成就感让我觉得所有的辛苦都是值得的。',
        '今天的天气特别好，心情也跟着明朗起来。做了很多想做的事情，感觉充实又满足。'
      ],
      happy: [
        '今天整体感觉不错，虽然没有什么特别的事情，但心情很平和愉快。小小的收获让我感到满足。',
        '和朋友聊天聊得很开心，分享彼此的近况。有这样的朋友真的很幸运。',
        '读了一本好书，学到了新的知识。这种学习的感觉让我很开心，觉得自己在不断成长。',
        '今天的工作进展顺利，没有什么压力。下班后还有时间做自己喜欢的事情。',
        '尝试了新的咖啡店，环境很舒适，咖啡也很好喝。这些小小的发现总是能带来快乐。'
      ],
      neutral: [
        '今天是很普通的一天，按部就班地完成了各种事务。没有什么特别的情绪波动，就是平平淡淡的日常。',
        '工作、吃饭、休息，日子就这样一天天过去。有时候觉得这样的平淡也挺好的。',
        '思考了一些人生的问题，但没有得出什么特别的结论。或许这就是成长的过程吧。',
        '今天的天气一般，心情也是一般。没有什么特别想记录的，就是想写点什么。',
        '看了一部电影，剧情还可以。现在的我对很多事情都没有强烈的感受，也许需要找回一些激情。'
      ],
      sad: [
        '今天遇到了一些挫折，心情有些低落。虽然知道这只是暂时的，但还是会感到沮丧。',
        '和朋友产生了一些误会，感觉很难受。希望能够尽快解决这个问题。',
        '工作上的压力让我感到有些疲惫，需要找个时间好好休息调整一下。',
        '看到一些不好的消息，心情受到了影响。有时候觉得这个世界变化太快了。',
        '今天没什么精神，做什么都提不起兴趣。可能是最近太累了，需要给自己一些时间。'
      ],
      very_sad: [
        '今天真的很难过，遇到了很大的打击。现在只想一个人静静，不想和任何人说话。',
        '感觉一切都不顺利，心情跌到了谷底。希望明天会好一些，但现在真的很绝望。',
        '发生了一些让我很痛苦的事情，现在还是无法接受这个现实。需要时间来消化这些情绪。',
        '今天哭了很久，感觉心里有个很大的洞。不知道什么时候才能重新振作起来。',
        '所有的事情都让我感到压抑，连呼吸都觉得困难。真的很希望有人能理解我现在的感受。'
      ]
    };
    
    const emotionContents = contents[emotion] || contents.neutral;
    return emotionContents[index % emotionContents.length];
  },

  // 模拟API调用
  async getJournalEntries(params = {}) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const journals = this.generateMockJournals();
    
    // 应用筛选条件
    let filteredJournals = journals;
    
    if (params.emotion) {
      filteredJournals = filteredJournals.filter(j => j.emotion === params.emotion);
    }
    
    if (params.startDate) {
      filteredJournals = filteredJournals.filter(j => 
        new Date(j.createdAt) >= new Date(params.startDate)
      );
    }
    
    if (params.endDate) {
      filteredJournals = filteredJournals.filter(j => 
        new Date(j.createdAt) <= new Date(params.endDate)
      );
    }
    
    // 分页
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedJournals = filteredJournals.slice(start, end);
    
    return {
      journals: paginatedJournals,
      page,
      limit,
      total: filteredJournals.length,
      totalPages: Math.ceil(filteredJournals.length / limit)
    };
  },

  async createJournalEntry(entryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newJournal = {
      id: `mock_journal_${Date.now()}`,
      ...entryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return newJournal;
  },

  async updateJournalEntry(id, entryData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      id,
      ...entryData,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteJournalEntry(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { success: true };
  },

  async getEmotionAnalysis(params = {}) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      trends: [
        { date: '06-20', mood: 4, stress: 2, energy: 4 },
        { date: '06-21', mood: 3, stress: 3, energy: 3 },
        { date: '06-22', mood: 5, stress: 1, energy: 5 },
        { date: '06-23', mood: 2, stress: 4, energy: 2 },
        { date: '06-24', mood: 4, stress: 2, energy: 4 },
        { date: '06-25', mood: 3, stress: 3, energy: 3 },
        { date: '06-26', mood: 4, stress: 2, energy: 4 }
      ],
      summary: {
        averageMood: 3.6,
        averageStress: 2.4,
        averageEnergy: 3.6,
        dominantEmotion: 'happy',
        improvementTrend: 'stable'
      },
      insights: [
        '本周你的整体心情比较稳定，开心的时候占多数',
        '压力水平相对较低，保持得很好',
        '建议在难过的时候尝试进行冥想练习',
        '你的能量水平与心情成正比，说明情绪管理很重要'
      ]
    };
  },

  async getJournalStats() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      totalEntries: 15,
      streakDays: 7,
      averageMood: 3.6,
      topEmotions: ['happy', 'neutral', 'very_happy'],
      weeklyProgress: 85,
      monthlyGrowth: 12
    };
  }
};
