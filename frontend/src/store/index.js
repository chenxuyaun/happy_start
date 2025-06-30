import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import journalSlice from './journalSlice';
import gardenSlice from './gardenSlice';
import aiSlice from './aiSlice';
import meditationSlice from './meditationSlice';

const rootReducer = combineReducers({
  user: userSlice,
  journal: journalSlice,
  garden: gardenSlice,
  ai: aiSlice,
  meditation: meditationSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
