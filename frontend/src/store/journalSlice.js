import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceManager from '../services/serviceManager';

// 异步action：获取日记列表
export const fetchJournals = createAsyncThunk(
  'journal/fetchJournals',
  async (params, { rejectWithValue }) => {
    try {
      const response = await serviceManager.journalService.getJournalEntries(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：创建日记
export const createJournal = createAsyncThunk(
  'journal/createJournal',
  async (journalData, { rejectWithValue }) => {
    try {
      const response = await serviceManager.journalService.createJournalEntry(journalData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：更新日记
export const updateJournal = createAsyncThunk(
  'journal/updateJournal',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await serviceManager.journalService.updateJournalEntry(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：删除日记
export const deleteJournal = createAsyncThunk(
  'journal/deleteJournal',
  async (id, { rejectWithValue }) => {
    try {
      await serviceManager.journalService.deleteJournalEntry(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：获取情绪分析
export const getEmotionAnalysis = createAsyncThunk(
  'journal/getEmotionAnalysis',
  async (params, { rejectWithValue }) => {
    try {
      const response = await serviceManager.journalService.getEmotionAnalysis(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  journals: [],
  currentJournal: null,
  emotionAnalysis: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  filters: {
    startDate: null,
    endDate: null,
    emotion: null,
  },
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    setCurrentJournal: (state, action) => {
      state.currentJournal = action.payload;
    },
    clearCurrentJournal: (state) => {
      state.currentJournal = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        startDate: null,
        endDate: null,
        emotion: null,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch journals
      .addCase(fetchJournals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournals.fulfilled, (state, action) => {
        state.loading = false;
        state.journals = action.payload.journals;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
        };
      })
      .addCase(fetchJournals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create journal
      .addCase(createJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.journals.unshift(action.payload);
        state.currentJournal = action.payload;
      })
      .addCase(createJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update journal
      .addCase(updateJournal.fulfilled, (state, action) => {
        const index = state.journals.findIndex(j => j.id === action.payload.id);
        if (index !== -1) {
          state.journals[index] = action.payload;
        }
        if (state.currentJournal?.id === action.payload.id) {
          state.currentJournal = action.payload;
        }
      })
      // Delete journal
      .addCase(deleteJournal.fulfilled, (state, action) => {
        state.journals = state.journals.filter(j => j.id !== action.payload);
        if (state.currentJournal?.id === action.payload) {
          state.currentJournal = null;
        }
      })
      // Emotion analysis
      .addCase(getEmotionAnalysis.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEmotionAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.emotionAnalysis = action.payload;
      })
      .addCase(getEmotionAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentJournal,
  clearCurrentJournal,
  setFilters,
  clearFilters,
  clearError,
} = journalSlice.actions;

export default journalSlice.reducer;
