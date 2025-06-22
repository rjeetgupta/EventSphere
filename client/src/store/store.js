import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import clubReducer from './clubSlice';
import eventReducer from './eventSlice';
import { eventApi } from './eventApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clubs: clubReducer,
    events: eventReducer,
    [eventApi.reducerPath]: eventApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(eventApi.middleware),
});

export default store;
