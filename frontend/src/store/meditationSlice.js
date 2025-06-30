import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { meditationService } from '../services/meditationService';

// 异步action：获取冥想课程列表
export const fetchMeditationCourses = createAsyncThunk(
  'meditation/fetchCourses',
  async (params, { rejectWithValue }) => {
    try {
      const response = await meditationService.getMeditationSessions(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：开始冥想会话
export const startMeditationSession = createAsyncThunk(
  'meditation/startSession',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await meditationService.startMeditation(courseId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：完成冥想会话
export const completeMeditationSession = createAsyncThunk(
  'meditation/completeSession',
  async (sessionData, { rejectWithValue }) => {
    try {
      const response = await meditationService.completeMeditation(sessionData.sessionId, sessionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：获取冥想统计
export const fetchMeditationStats = createAsyncThunk(
  'meditation/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await meditationService.getMeditationStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  courses: [],
  currentSession: null,
  sessionHistory: [],
  stats: {
    totalSessions: 0,
    totalMinutes: 0,
    streak: 0,
    favoriteType: null,
  },
  activeTimer: {
    duration: 0,
    elapsed: 0,
    isRunning: false,
    isPaused: false,
  },
  settings: {
    backgroundMusic: true,
    guidedVoice: true,
    reminderEnabled: true,
    reminderTime: '20:00',
    sessionGoal: 10, // minutes per day
  },
  loading: false,
  error: null,
};

const meditationSlice = createSlice({
  name: 'meditation',
  initialState,
  reducers: {
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload;
    },
    clearCurrentSession: (state) => {
      state.currentSession = null;
      state.activeTimer = {
        duration: 0,
        elapsed: 0,
        isRunning: false,
        isPaused: false,
      };
    },
    startTimer: (state, action) => {
      state.activeTimer = {
        duration: action.payload,
        elapsed: 0,
        isRunning: true,
        isPaused: false,
      };
    },
    pauseTimer: (state) => {
      state.activeTimer.isRunning = false;
      state.activeTimer.isPaused = true;
    },
    resumeTimer: (state) => {
      state.activeTimer.isRunning = true;
      state.activeTimer.isPaused = false;
    },
    stopTimer: (state) => {
      state.activeTimer = {
        duration: 0,
        elapsed: 0,
        isRunning: false,
        isPaused: false,
      };
    },
    updateTimerElapsed: (state, action) => {
      state.activeTimer.elapsed = action.payload;
    },
    updateSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    addToHistory: (state, action) => {
      state.sessionHistory.unshift(action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchMeditationCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeditationCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchMeditationCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start session
      .addCase(startMeditationSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startMeditationSession.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSession = action.payload;
      })
      .addCase(startMeditationSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Complete session
      .addCase(completeMeditationSession.fulfilled, (state, action) => {
        state.sessionHistory.unshift(action.payload);
        state.stats.totalSessions += 1;
        state.stats.totalMinutes += action.payload.duration;
        state.currentSession = null;
        state.activeTimer = {
          duration: 0,
          elapsed: 0,
          isRunning: false,
          isPaused: false,
        };
      })
      // Fetch stats
      .addCase(fetchMeditationStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  setCurrentSession,
  clearCurrentSession,
  startTimer,
  pauseTimer,
  resumeTimer,
  stopTimer,
  updateTimerElapsed,
  updateSettings,
  addToHistory,
  clearError,
} = meditationSlice.actions;

export default meditationSlice.reducer;
