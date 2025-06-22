import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/apiClient';

// Async thunks
export const fetchClubs = createAsyncThunk(
  'clubs/fetchClubs',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/clubs', { params: filters });
      console.log(response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch clubs');
    }
  }
);

export const fetchClubById = createAsyncThunk(
  'clubs/fetchClubById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/clubs/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch club');
    }
  }
);

export const createClub = createAsyncThunk(
  'clubs/createClub',
  async (clubData, { rejectWithValue }) => {
    try {
      console.log(clubData);
      const response = await apiClient.post('/clubs/create-club', clubData );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create club');
    }
  }
);

export const updateClub = createAsyncThunk(
  'clubs/updateClub',
  async ({ id, clubData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/clubs/${id}`, clubData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update club');
    }
  }
);

export const deleteClub = createAsyncThunk(
  'clubs/deleteClub',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/clubs/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete club');
    }
  }
);

export const joinClub = createAsyncThunk(
  'clubs/joinClub',
  async (clubId, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/clubs/${clubId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join club');
    }
  }
);

export const leaveClub = createAsyncThunk(
  'clubs/leaveClub',
  async (clubId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/clubs/${clubId}/join`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave club');
    }
  }
);

const initialState = {
  clubs: [],
  selectedClub: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,
};

const clubSlice = createSlice({
  name: 'clubs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedClub: (state) => {
      state.selectedClub = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Clubs
      .addCase(fetchClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubs.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure state.clubs is always an array
        if (Array.isArray(action.payload)) {
          state.clubs = action.payload;
          state.total = action.payload.length;
          state.page = 1;
          state.totalPages = 1;
        } else if (Array.isArray(action.payload?.clubs)) {
          state.clubs = action.payload.clubs;
          state.total = action.payload.total || action.payload.clubs.length;
          state.page = action.payload.page || 1;
          state.totalPages = action.payload.totalPages || 1;
        } else {
          state.clubs = [];
          state.total = 0;
          state.page = 1;
          state.totalPages = 1;
        }
      })
      .addCase(fetchClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Club by ID
      .addCase(fetchClubById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClubById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClub = action.payload;
      })
      .addCase(fetchClubById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Club
      .addCase(createClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClub.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs.push(action.payload);
      })
      .addCase(createClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Club
      .addCase(updateClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClub.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clubs.findIndex((club) => club._id === action.payload._id);
        if (index !== -1) {
          state.clubs[index] = action.payload;
        }
        state.selectedClub = action.payload;
      })
      .addCase(updateClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Club
      .addCase(deleteClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClub.fulfilled, (state, action) => {
        state.loading = false;
        state.clubs = state.clubs.filter((club) => club._id !== action.payload);
        state.selectedClub = null;
      })
      .addCase(deleteClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Join Club
      .addCase(joinClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinClub.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedClub) {
          state.selectedClub.members.push(action.payload);
          state.selectedClub.membersCount += 1;
        }
      })
      .addCase(joinClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Leave Club
      .addCase(leaveClub.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveClub.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedClub) {
          state.selectedClub.members = state.selectedClub.members.filter(
            (member) => member._id !== action.payload._id
          );
          state.selectedClub.membersCount -= 1;
        }
      })
      .addCase(leaveClub.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedClub } = clubSlice.actions;
export default clubSlice.reducer;

// Selectors
export const selectClubs = (state) => state.clubs.clubs;
export const selectSelectedClub = (state) => state.clubs.selectedClub;
export const selectClubsLoading = (state) => state.clubs.loading;
export const selectClubsError = (state) => state.clubs.error; 