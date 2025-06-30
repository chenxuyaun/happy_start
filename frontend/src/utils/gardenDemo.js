// 花园演示工具函数
export const gardenDemo = {
  // 生成随机植物数据
  generateRandomPlant: (id) => {
    const plantTypes = ['向日葵', '玫瑰', '郁金香', '薰衣草', '茉莉花', '牡丹'];
    const randomType = plantTypes[Math.floor(Math.random() * plantTypes.length)];
    
    return {
      id: `plant-${id}`,
      type: randomType,
      growth: Math.floor(Math.random() * 100),
      position: {
        x: (Math.random() - 0.5) * 12, // -6 到 6 之间
        z: (Math.random() - 0.5) * 12, // -6 到 6 之间
      },
      lastWatered: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      plantedAt: new Date(Date.now() - Math.random() * 172800000).toISOString(),
    };
  },

  // 生成演示花园状态
  generateDemoGarden: (plantCount = 5) => {
    const plants = [];
    for (let i = 1; i <= plantCount; i++) {
      plants.push(gardenDemo.generateRandomPlant(i));
    }

    return {
      plants,
      level: Math.floor(Math.random() * 10) + 1,
      experience: Math.floor(Math.random() * 1000),
      coins: Math.floor(Math.random() * 500) + 100,
      achievements: ['first_plant', 'water_master', 'green_thumb'],
    };
  },

  // 模拟种植动作
  simulatePlant: (position, type = '新花朵') => {
    return {
      id: `plant-${Date.now()}`,
      type,
      growth: 0,
      position,
      lastWatered: null,
      plantedAt: new Date().toISOString(),
    };
  },

  // 模拟浇水效果
  simulateWater: (plant) => {
    return {
      ...plant,
      lastWatered: new Date().toISOString(),
      growth: Math.min(100, plant.growth + Math.floor(Math.random() * 20) + 5),
    };
  },

  // 计算植物颜色（基于成长度）
  getPlantColor: (growth) => {
    if (growth < 30) return '#90EE90'; // 浅绿色 - 幼苗
    if (growth < 70) return '#228B22'; // 深绿色 - 成长中
    return '#FF69B4'; // 粉色 - 开花
  },

  // 计算植物大小
  getPlantSize: (growth) => {
    const baseSize = 0.5;
    return baseSize + (growth / 100) * 1.5;
  },

  // 获取植物成长阶段描述
  getGrowthStage: (growth) => {
    if (growth < 30) return '幼苗期';
    if (growth < 70) return '成长期';
    if (growth < 95) return '开花期';
    return '成熟期';
  },

  // 检查是否需要浇水
  needsWater: (plant) => {
    if (!plant.lastWatered) return true;
    const lastWatered = new Date(plant.lastWatered);
    const now = new Date();
    const hoursSinceWatered = (now - lastWatered) / (1000 * 60 * 60);
    return hoursSinceWatered > 24; // 24小时没浇水需要浇水
  },

  // 计算经验值奖励
  calculateExperience: (action, growth = 0) => {
    switch (action) {
      case 'plant': return 10;
      case 'water': return 5;
      case 'harvest': return growth > 80 ? 25 : 15;
      default: return 0;
    }
  },

  // 计算金币奖励
  calculateCoins: (action, growth = 0) => {
    switch (action) {
      case 'harvest': return growth > 90 ? 30 : growth > 60 ? 20 : 10;
      case 'daily_care': return 5;
      default: return 0;
    }
  }
};

export default gardenDemo;
