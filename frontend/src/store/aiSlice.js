import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { aiService } from '../services/aiService';

// 异步action：发送消息给AI
export const sendMessageToAI = createAsyncThunk(
  'ai/sendMessage',
  async (message, { rejectWithValue }) => {
    try {
      const response = await aiService.sendMessage(message);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：获取情绪建议
export const getEmotionSuggestions = createAsyncThunk(
  'ai/getEmotionSuggestions',
  async (emotionData, { rejectWithValue }) => {
    try {
      const response = await aiService.getEmotionSuggestions(emotionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 异步action：获取聊天历史
export const fetchChatHistory = createAsyncThunk(
  'ai/fetchChatHistory',
  async (params, { rejectWithValue }) => {
    try {
      const response = await aiService.getChatHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  messages: [],
  currentConversation: null,
  isTyping: false,
  loading: false,
  error: null,
  suggestions: [],
  aiPersonality: 'caring', // 'caring', 'energetic', 'calm'
  chatSettings: {
    autoSuggestions: true,
    emotionAnalysis: true,
    voiceResponse: false,
  },
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    setAiPersonality: (state, action) => {
      state.aiPersonality = action.payload;
    },
    updateChatSettings: (state, action) => {
      state.chatSettings = { ...state.chatSettings, ...action.payload };
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    clearSuggestions: (state) => {
      state.suggestions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send message
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
        state.isTyping = true;
        state.error = null;
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        // AI response message
        state.messages.push({
          id: Date.now(),
          type: 'ai',
          content: action.payload.response,
          emotion: action.payload.detectedEmotion,
          suggestions: action.payload.suggestions,
          timestamp: new Date().toISOString(),
        });
        if (action.payload.suggestions) {
          state.suggestions = action.payload.suggestions;
        }
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false;
        state.isTyping = false;
        state.error = action.payload;
      })
      // Get emotion suggestions
      .addCase(getEmotionSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      })
      // Fetch chat history
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addMessage,
  setIsTyping,
  clearMessages,
  setAiPersonality,
  updateChatSettings,
  setSuggestions,
  clearSuggestions,
  clearError,
} = aiSlice.actions;

export default aiSlice.reducer;
