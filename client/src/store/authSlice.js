// src/store/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { ROLES } from "@/constants/roles";

// Secure token management utilities
const TOKEN_KEYS = {
  ACCESS: 'accessToken',
  REFRESH: 'refreshToken',
  USER: 'user'
};

const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return localStorage.getItem(key);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  clear: () => {
    try {
      Object.values(TOKEN_KEYS).forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }
};

// Initialize state from storage
const initializeAuth = () => {
  const user = storage.get(TOKEN_KEYS.USER);
  const accessToken = storage.get(TOKEN_KEYS.ACCESS);

  return {
    user: user || null,
    isAuthenticated: !!(user && accessToken),
    role: user?.role || null,
    loading: false,
    error: null,
  };
};

const initialState = initializeAuth();

// Async thunks
export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message ||
        error.response?.data?.error ||
        "Registration failed. Please try again.";
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const endpoint = role === ROLES.ADMIN ? "/admin/login-admin" : "/auth/login";
      const response = await apiClient.post(endpoint, { email, password });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message ||
        error.response?.data?.error ||
        "Login failed. Please check your credentials.";
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint if you have one
      // await apiClient.post("/auth/logout");

      // Clear storage
      storage.clear();

      return null;
    } catch (error) {
      // Still clear local storage even if API call fails
      storage.clear();
      return rejectWithValue("Logout failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/change-password", passwordData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update password";
      return rejectWithValue(message);
    }
  }
);

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.role = payload.user.role;
      state.isAuthenticated = true;
      state.error = null;

      storage.set(TOKEN_KEYS.USER, payload.user);
      if (payload.accessToken) {
        storage.set(TOKEN_KEYS.ACCESS, payload.accessToken);
      }
      if (payload.refreshToken) {
        storage.set(TOKEN_KEYS.REFRESH, payload.refreshToken);
      }
    },

    clearCredentials: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      state.error = null;
      storage.clear();
    },

    clearError: (state) => {
      state.error = null;
    },

    updateUser: (state, { payload }) => {
      if (state.user) {
        state.user = { ...state.user, ...payload };
        storage.set(TOKEN_KEYS.USER, state.user);
      }
    }
  },

  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;

        if (payload.data) {
          state.user = payload.data.user;
          state.role = payload.data.user.role;
          state.isAuthenticated = true;

          storage.set(TOKEN_KEYS.USER, payload.data.user);
          if (payload.data.accessToken) {
            storage.set(TOKEN_KEYS.ACCESS, payload.data.accessToken);
          }
          if (payload.data.refreshToken) {
            storage.set(TOKEN_KEYS.REFRESH, payload.data.refreshToken);
          }
        }
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.isAuthenticated = false;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.error = null;

        if (payload.data) {
          state.user = payload.data.user;
          state.role = payload.data.user.role;
          state.isAuthenticated = true;

          storage.set(TOKEN_KEYS.USER, payload.data.user);
          storage.set(TOKEN_KEYS.ACCESS, payload.data.accessToken);
          storage.set(TOKEN_KEYS.REFRESH, payload.data.refreshToken);
        }
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        // Still clear state even if logout API fails
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        state.loading = false;
      })

      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

// Actions
export const { setCredentials, clearCredentials, clearError, updateUser } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;