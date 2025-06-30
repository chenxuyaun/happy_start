import api from './api';

export const gardenService = {
  // 获取花园状态
  async getGardenState() {
    try {
      const response = await api.get('/garden/state');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取花园状态失败');
    }
  },

  // 种植花朵
  async plantFlower(plantData) {
    try {
      const response = await api.post('/garden/plant', plantData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '种植失败');
    }
  },

  // 浇水
  async waterPlant(plantId) {
    try {
      const response = await api.post(`/garden/plants/${plantId}/water`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '浇水失败');
    }
  },

  // 获取花园活动记录
  async getGardenActivities(params = {}) {
    try {
      const response = await api.get('/garden/activities', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取活动记录失败');
    }
  },

  // 收获植物
  async harvestPlant(plantId) {
    try {
      const response = await api.post(`/garden/plants/${plantId}/harvest`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '收获失败');
    }
  },

  // 购买种子
  async buySeeds(seedType, quantity) {
    try {
      const response = await api.post('/garden/buy-seeds', {
        seedType,
        quantity
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '购买种子失败');
    }
  },

  // 获取可用植物类型
  async getPlantTypes() {
    try {
      const response = await api.get('/garden/plant-types');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || '获取植物类型失败');
    }
  }
};
