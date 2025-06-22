import { format } from 'date-fns';
import apiClient from '@/services/apiClient';
import { DEPARTMENTS } from '@/constants/departments';

// Mock Data
const MOCK_EVENTS = [
  {
    id: '1',
    title: 'TechFest 2025',
    description: 'The biggest tech festival of the year.',
    date: '2025-05-15',
    time: '09:00 AM - 05:00 PM',
    venue: 'Main Auditorium',
    department: 'Computer Science',
    organizer: { id: '2', name: 'Tech Club', type: 'club' },
    maxParticipants: 300,
    currentParticipants: 210,
    image: 'https://example.com/techfest.jpg',
    status: 'upcoming',
    tags: ['Technology', 'Workshop'],
    attendees: []
  },
  {
    id: '2',
    title: 'Cultural Night',
    description: 'Annual cultural festival',
    date: '2025-06-20',
    time: '06:00 PM - 10:00 PM',
    venue: 'Open Air Theater',
    department: 'Arts',
    organizer: { id: '3', name: 'Cultural Club', type: 'club' },
    maxParticipants: 500,
    currentParticipants: 350,
    image: 'https://example.com/cultural.jpg',
    status: 'upcoming',
    tags: ['Cultural', 'Performance'],
    attendees: []
  }
];

const MOCK_CLUBS = [
  {
    id: '1',
    name: 'Tech Club',
    description: 'Technology enthusiasts club',
    department: 'Computer Science',
    logo: 'https://example.com/techclub.jpg',
    membersCount: 120,
    eventsHosted: 8,
    status: 'active',
    createdAt: '2023-01-15'
  },
  {
    id: '2',
    name: 'Cultural Club',
    description: 'Cultural activities club',
    department: 'Arts',
    logo: 'https://example.com/culturalclub.jpg',
    membersCount: 85,
    eventsHosted: 5,
    status: 'active',
    createdAt: '2023-02-10'
  }
];

const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@college.edu',
    role: 'admin',
    department: 'Administration',
    avatar: 'https://example.com/admin.jpg',
    eventsAttended: 15,
    registeredEvents: 20,
    createdAt: '2023-01-01'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@college.edu',
    role: 'student',
    department: 'Computer Science',
    year: 3,
    avatar: 'https://example.com/john.jpg',
    eventsAttended: 8,
    registeredEvents: 12,
    createdAt: '2023-02-15'
  }
];

// Helper Functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Event API
export const getEvents = async (filters = {}) => {
  try {
    const response = await apiClient.get('/events', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch events');
  }
};

export const getEventById = async (id) => {
  try {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch event details');
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/events/create-event', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create event');
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await apiClient.patch(`/events/update-event/${id}`, eventData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update event');
  }
};

export const deleteEvent = async (id) => {
  try {
    await apiClient.delete(`/events/update-event/${id}`);
    return true;
  } catch (error) {
    throw new Error('Failed to delete event');
  }
};

// Register for Event
export const registerForEvent = async (eventId) => {
  try {
    const response = await apiClient.post(`/events/${eventId}/register`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to register for event');
  }
};

export const cancelRegistration = async (eventId) => {
  try {
    const response = await apiClient.delete(`/events/${eventId}/register`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to cancel registration');
  }
};

// Club API
export const getClubs = async (filters = {}) => {
  try {
    const response = await apiClient.get('/clubs', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch clubs');
  }
};

export const getClubById = async (id) => {
  try {
    const response = await apiClient.get(`/clubs/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch club details');
  }
};

export const createClub = async (clubData) => {
  try {
    const response = await apiClient.post('/clubs/create-club', clubData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create club');
  }
};

export const updateClub = async (id, clubData) => {
  try {
    const response = await apiClient.patch(`/clubs/${id}`, clubData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update club');
  }
};

export const deleteClub = async (id) => {
  try {
    await apiClient.delete(`/clubs/${id}`);
    return true;
  } catch (error) {
    throw new Error('Failed to delete club');
  }
};

export const assignManagerToClub = async (clubId, userId) => {
  try {
    const response = await apiClient.patch(`/clubs/update-club/${clubId}`, { manager: userId });
    return response.data;
  } catch (error) {
    throw new Error('Failed to assign manager');
  }
};

// User API
export const getUsers = async (filters = {}) => {
  try {
    const response = await apiClient.get('/users', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch user details');
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

// Analytics API
export const getEventsAnalytics = async () => {
  try {
    const response = await apiClient.get('/analytics/events');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch events analytics');
  }
};

export const getUsersAnalytics = async () => {
  try {
    const response = await apiClient.get('/analytics/users');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch users analytics');
  }
};

// Full Mock Data Export
export const getMockData = () => ({
  events: MOCK_EVENTS,
  clubs: MOCK_CLUBS,
  users: MOCK_USERS,
  departments: DEPARTMENTS
});