// src/store/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { ROLES } from "@/constants/roles";
import * as jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const initialState = {
  user: localStorage.getItem("user") || null,
  isAuthenticated: localStorage.getItem("token") ? true : false,
  role: null,
  loading: false,
  error: null,
};
console.log("this is " , initialState);

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
      return { ...res.data, role: "student" };
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

// export const logout = createAsyncThunk(
//   "auth/logout",
//   async (role, { rejectWithValue }) => {
//     console.log(role);
//     try {
//       // const endpoint =
//       //   role === ROLES.ADMIN ? "/admin/logout-admin" : "/auth/logout";
//       const token = localStorage.getItem("accessToken");

//       if (token) {
//         await apiClient.post('/auth/logout', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//       }

//       return true;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Logout failed");
//     }
//   }
// );

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // ✅ Just clear localStorage and cookies
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      
      console.log('ye work')
      return true;
    } catch (error) {
      return rejectWithValue("Client-side logout failed");
    }
  }
);



// Change Password

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData, { getState, rejectWithValue }) => {
    console.log(passwordData);
    try {
      const { token } = getState().auth;
      const res = await apiClient.patch(
        "/users/change-password",
        passwordData,
        {
          headers: getAuthHeaders(token),
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

const getUserFromToken = (token) => {
  try {
    return jwtDecode.default(token);
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.role = payload.role;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    loadUserFromToken: (state) => {
      const token = localStorage.getItem("token");
      console.log('this is token', token)
      if (token) {
        const user = getUserFromToken(token);
        console.log("thi is user", user)
        if (user) {
          state.user = user;
          state.role = user.role;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.role = null;
          state.isAuthenticated = false;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.data.user;
        console.log("this is user", payload.data.user)
        state.role = payload.data.user.role;
        state.isAuthenticated = true;
        localStorage.setItem("accessToken", payload.data.accessToken);
        localStorage.setItem("token", payload.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(payload.data.user));
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      // Logout cases
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.role = null;
        state.isAuthenticated = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.role = "student";
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // change password
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
