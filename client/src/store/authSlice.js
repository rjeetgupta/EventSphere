// src/store/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { ROLES } from "@/constants/roles";
import Cookies from "js-cookie";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  role: JSON.parse(localStorage.getItem("user"))?.role || null,
  loading: false,
  error: null,
};

// Helper function to set auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await apiClient.post("/auth/register", userData);
      return { ...res.data, role: ROLES.STUDENT };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const endpoint =
        role === ROLES.ADMIN ? "/admin/login-admin" : "/auth/login";
      const res = await apiClient.post(endpoint, { email, password });
      return res.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      Cookies.remove("token");
      return true;
    } catch {
      return rejectWithValue("Client-side logout failed");
    }
  }
);

// Change Password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const res = await apiClient.patch(
        "/users/change-password",
        passwordData,
        { headers: getAuthHeaders() }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.role = payload.user.role;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(payload.user));
    },
    clearCredentials: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    },
    loadUserFromToken: (state) => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        state.user = storedUser;
        state.role = storedUser.role;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.data.user;
        state.role = payload.data.user.role;
        state.isAuthenticated = true;

        localStorage.setItem("accessToken", payload.data.accessToken);
        localStorage.setItem("refreshToken", payload.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(payload.data.user));
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.role = ROLES.STUDENT;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(payload.user));
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
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

export const { setCredentials, clearCredentials, loadUserFromToken } =
  authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectUserRole = (state) => state.auth.role;

export default authSlice.reducer;
