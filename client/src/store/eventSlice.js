import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/services/apiClient';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/events', { params: filters });
      console.log('Events API response:', response.data);
      
      // Handle the nested response structure
      if (response.data?.data?.events) {
        // Response format: { data: { events: [...], total: 4, page: 1, totalPages: 1 } }
        return {
          events: response.data.data.events,
          total: response.data.data.total,
          page: response.data.data.page,
          totalPages: response.data.data.totalPages
        };
      } else if (Array.isArray(response.data)) {
        // Direct array response
        return response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        // Response format: { data: [...] }
        return response.data.data;
      } else {
        // Fallback
      return response.data;
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/events/${id}`);
      console.log('Event by ID response:', response.data);
      // Extract data from ApiResponse format
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      console.log('Creating event with data:', eventData);
      const response = await apiClient.post('/events/create-event', eventData);
      console.log('Create event response:', response.data);
      // Extract data from ApiResponse format
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, ...eventData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/events/update-event/${id}`, eventData);
      // Extract data from ApiResponse format
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/events/update-event/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

export const registerForEvent = createAsyncThunk(
  'events/registerForEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      console.log('Registering for event:', eventId);
      const response = await apiClient.post(`/events/${eventId}/register`);
      console.log('Register response:', response.data);
      // Extract data from ApiResponse format
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error registering for event:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to register for event');
    }
  }
);

export const cancelRegistration = createAsyncThunk(
  'events/cancelRegistration',
  async (eventId, { rejectWithValue }) => {
    try {
      console.log('Cancelling registration for event:', eventId);
      const response = await apiClient.delete(`/events/${eventId}/register`);
      console.log('Cancel registration response:', response.data);
      // Extract data from ApiResponse format
      return response.data?.data || response.data;
    } catch (error) {
      console.error('Error cancelling registration:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel registration');
    }
  }
);

const initialState = {
  events: [],
  selectedEvent: null,
  loading: false,
  error: null,
  // Pagination state
  total: 0,
  page: 1,
  totalPages: 1,
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        
        // Check if action.payload is an array (events only) or object (with pagination)
        if (Array.isArray(action.payload)) {
        state.events = action.payload;
        } else if (action.payload?.events) {
          // Handle paginated response
          state.events = action.payload.events;
          state.total = action.payload.total || 0;
          state.page = action.payload.page || 1;
          state.totalPages = action.payload.totalPages || 1;
        } else {
          // Fallback
          state.events = action.payload || [];
        }
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex((event) => event._id === action.payload._id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        state.selectedEvent = action.payload;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter((event) => event._id !== action.payload);
        state.selectedEvent = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register for Event
      .addCase(registerForEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.loading = false;
        // Update the selected event with the new data
        if (state.selectedEvent && action.payload) {
          state.selectedEvent = action.payload;
        }
        // Also update the event in the events list if it exists
        const eventIndex = state.events.findIndex(event => event._id === action.payload?._id);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Registration
      .addCase(cancelRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelRegistration.fulfilled, (state, action) => {
        state.loading = false;
        // Update the selected event with the new data
        if (state.selectedEvent && action.payload) {
          state.selectedEvent = action.payload;
        }
        // Also update the event in the events list if it exists
        const eventIndex = state.events.findIndex(event => event._id === action.payload?._id);
        if (eventIndex !== -1) {
          state.events[eventIndex] = action.payload;
        }
      })
      .addCase(cancelRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;

// Selectors
export const selectEvents = (state) => state.events.events;
export const selectSelectedEvent = (state) => state.events.selectedEvent;
export const selectEventsLoading = (state) => state.events.loading;
export const selectEventsError = (state) => state.events.error; 
export const selectEventsTotal = (state) => state.events.total;
export const selectEventsPage = (state) => state.events.page;
export const selectEventsTotalPages = (state) => state.events.totalPages; 