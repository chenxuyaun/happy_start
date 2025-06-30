import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { gardenService } from '../services/gardenService';

// 异步action：获取花园状态
export const fetchGardenState = createAsyncThunk(
  'garden/fetchGardenState',
  async (_, { rejectWithValue }) => {
    try {
      const response = await gardenService.getGardenState();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：种植植物
export const plantFlower = createAsyncThunk(
  'garden/plantFlower',
  async (plantData, { rejectWithValue }) => {
    try {
      const response = await gardenService.plantFlower(plantData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：浇水
export const waterPlant = createAsyncThunk(
  'garden/waterPlant',
  async (plantId, { rejectWithValue }) => {
    try {
      const response = await gardenService.waterPlant(plantId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：获取花园活动记录
export const fetchGardenActivities = createAsyncThunk(
  'garden/fetchGardenActivities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await gardenService.getGardenActivities(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 模拟数据用于开发测试
const mockPlants = [
  {
    id: 'plant-1',
    type: '向日葵',
    growth: 45,
    position: { x: -3, z: -3 },
    lastWatered: new Date().toISOString(),
    plantedAt: new Date(Date.now() - 86400000).toISOString(), // 1天前
  },
  {
    id: 'plant-2',
    type: '玫瑰',
    growth: 78,
    position: { x: 0, z: 0 },
    lastWatered: new Date(Date.now() - 3600000).toISOString(), // 1小时前
    plantedAt: new Date(Date.now() - 172800000).toISOString(), // 2天前
  },
  {
    id: 'plant-3',
    type: '郁金香',
    growth: 23,
    position: { x: 3, z: 3 },
    lastWatered: new Date(Date.now() - 7200000).toISOString(), // 2小时前
    plantedAt: new Date().toISOString(),
  },
];

const initialState = {
  gardenState: {
    plants: mockPlants,
    level: 3,
    experience: 245,
    coins: 350,
    achievements: ['first_plant', 'water_master'],
  },
  activities: [],
  selectedPlant: null,
  gardenMode: 'view', // 'view', 'plant', 'water'
  loading: false,
  error: null,
  weather: 'sunny',
  timeOfDay: 'day',
};

const gardenSlice = createSlice({
  name: 'garden',
  initialState,
  reducers: {
    setSelectedPlant: (state, action) => {
      state.selectedPlant = action.payload;
    },
    clearSelectedPlant: (state) => {
      state.selectedPlant = null;
    },
    setGardenMode: (state, action) => {
      state.gardenMode = action.payload;
    },
    setWeather: (state, action) => {
      state.weather = action.payload;
    },
    setTimeOfDay: (state, action) => {
      state.timeOfDay = action.payload;
    },
    updatePlantGrowth: (state, action) => {
      const { plantId, growth } = action.payload;
      const plant = state.gardenState.plants.find(p => p.id === plantId);
      if (plant) {
        plant.growth = growth;
      }
    },
    addExperience: (state, action) => {
      state.gardenState.experience += action.payload;
      // 简单的升级逻辑
      const newLevel = Math.floor(state.gardenState.experience / 100) + 1;
      if (newLevel > state.gardenState.level) {
        state.gardenState.level = newLevel;
        state.gardenState.coins += 50; // 升级奖励
      }
    },
    addCoins: (state, action) => {
      state.gardenState.coins += action.payload;
    },
    spendCoins: (state, action) => {
      state.gardenState.coins = Math.max(0, state.gardenState.coins - action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch garden state
      .addCase(fetchGardenState.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGardenState.fulfilled, (state, action) => {
        state.loading = false;
        state.gardenState = action.payload;
      })
      .addCase(fetchGardenState.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Plant flower
      .addCase(plantFlower.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(plantFlower.fulfilled, (state, action) => {
        state.loading = false;
        state.gardenState.plants.push(action.payload.plant);
        state.gardenState.coins -= action.payload.cost;
        state.gardenState.experience += action.payload.experience;
      })
      .addCase(plantFlower.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Water plant
      .addCase(waterPlant.fulfilled, (state, action) => {
        const plant = state.gardenState.plants.find(p => p.id === action.payload.plantId);
        if (plant) {
          plant.lastWatered = action.payload.timestamp;
          plant.growth += action.payload.growthIncrease;
        }
        state.gardenState.experience += action.payload.experience;
      })
      // Fetch activities
      .addCase(fetchGardenActivities.fulfilled, (state, action) => {
        state.activities = action.payload;
      });
  },
});

export const {
  setSelectedPlant,
  clearSelectedPlant,
  setGardenMode,
  setWeather,
  setTimeOfDay,
  updatePlantGrowth,
  addExperience,
  addCoins,
  spendCoins,
  clearError,
} = gardenSlice.actions;

export default gardenSlice.reducer;
