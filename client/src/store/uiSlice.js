import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: {
    global: false,
    events: false,
    clubs: false,
    auth: false,
  },
  notifications: [],
  modals: {
    eventForm: false,
    clubForm: false,
    confirmDelete: false,
  },
  theme: localStorage.getItem('theme') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    toggleModal: (state, action) => {
      const { modal, value } = action.payload;
      state.modals[modal] = value;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export const {
  setLoading,
  addNotification,
  removeNotification,
  toggleModal,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer; 