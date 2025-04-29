import { format } from 'date-fns';

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

const MOCK_DEPARTMENTS = [
  { id: '1', name: 'Computer Science', eventsCount: 15, studentsCount: 450 },
  { id: '2', name: 'Arts', eventsCount: 10, studentsCount: 300 }
];

// Helper Functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Event API
export const getEvents = async (filters = {}) => {
  await delay(800);
  let results = [...MOCK_EVENTS];
  
  if (filters.department) {
    results = results.filter(e => e.department === filters.department);
  }
  if (filters.status) {
    results = results.filter(e => e.status === filters.status);
  }
  if (filters.search) {
    const term = filters.search.toLowerCase();
    results = results.filter(e => 
      e.title.toLowerCase().includes(term) || 
      e.description.toLowerCase().includes(term)
    );
  }
  return results;
};



export const getEventById = async (id) => {
  await delay(500);
  return MOCK_EVENTS.find(event => event.id === id) || null;
};

export const createEvent = async (eventData) => {
  await delay(1000);
  const newEvent = {
    ...eventData,
    id: Math.random().toString(36).substring(2, 9),
    currentParticipants: 0,
    attendees: [],
    status: 'upcoming'
  };
  MOCK_EVENTS.push(newEvent);
  return newEvent;
};


// Register for Event
export const registerForEvent = async (eventId, userId, userName, userEmail) => {
  await delay(800);
  const event = MOCK_EVENTS.find(e => e.id === eventId);
  if (!event || event.currentParticipants >= event.maxParticipants) return false;
  
  event.attendees.push({
    id: userId,
    name: userName,
    email: userEmail,
    attended: false,
    registrationDate: format(new Date(), 'yyyy-MM-dd')
  });
  event.currentParticipants++;
  return true;
};

export const cancelRegistration = async (eventId, userId) => {
  await delay(800);
  
  const eventIndex = MOCK_EVENTS.findIndex(event => event.id === eventId);
  if (eventIndex === -1) return false;
  
  const event = MOCK_EVENTS[eventIndex];
  
  // Check if registered
  const attendeeIndex = event.attendees.findIndex(attendee => attendee.id === userId);
  if (attendeeIndex === -1) return false;
  
  // Remove registration
  event.attendees.splice(attendeeIndex, 1);
  event.currentParticipants -= 1;
  return true;
};

// Club API
export const getClubs = async (filters = {}) => {
  await delay(800);
  let results = [...MOCK_CLUBS];
  
  if (filters.department) {
    results = results.filter(c => c.department === filters.department);
  }
  if (filters.status) {
    results = results.filter(c => c.status === filters.status);
  }
  return results;
};

// User API
export const getUsers = async (filters = {}) => {
  await delay(800);
  let results = [...MOCK_USERS];
  
  if (filters.role) {
    results = results.filter(u => u.role === filters.role);
  }
  if (filters.department) {
    results = results.filter(u => u.department === filters.department);
  }
  return results;
};

// Analytics API
// export const getEventsAnalytics = async () => {
//   await delay(1000);
//   return {
//     totalEvents: MOCK_EVENTS.length,
//     upcomingEvents: MOCK_EVENTS.filter(e => e.status === 'upcoming').length,
//     departments: MOCK_DEPARTMENTS.map(dept => ({
//       name: dept.name,
//       eventCount: MOCK_EVENTS.filter(e => e.department === dept.name).length
//     }))
//   };
// };

export const getEventsAnalytics = async () => {
  await delay(1000);
  
  // Calculate mock analytics
  const totalEvents = MOCK_EVENTS.length;
  const upcomingEvents = MOCK_EVENTS.filter(event => event.status === 'upcoming').length;
  const completedEvents = MOCK_EVENTS.filter(event => event.status === 'completed').length;
  const cancelledEvents = MOCK_EVENTS.filter(event => event.status === 'cancelled').length;
  
  const totalParticipants = MOCK_EVENTS.reduce((sum, event) => sum + event.currentParticipants, 0);
  const averageAttendance = totalEvents > 0 ? Math.round(totalParticipants / totalEvents) : 0;
  
  // Department distribution
  const departments = [...new Set(MOCK_EVENTS.map(event => event.department))];
  const departmentDistribution = departments.map(dept => ({
    name: dept,
    count: MOCK_EVENTS.filter(event => event.department === dept).length,
  }));
  
  // Monthly distribution (mock data)
  const monthlyEvents = [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 15 },
    { month: 'May', count: 10 },
    { month: 'Jun', count: 7 },
    { month: 'Jul', count: 9 },
    { month: 'Aug', count: 6 },
    { month: 'Sep', count: 11 },
    { month: 'Oct', count: 14 },
    { month: 'Nov', count: 8 },
    { month: 'Dec', count: 6 },
  ];
  
  return {
    totalEvents,
    upcomingEvents,
    completedEvents,
    cancelledEvents,
    totalParticipants,
    averageAttendance,
    departmentDistribution,
    monthlyEvents,
  };
};

export const getUsersAnalytics = async () => {
  await delay(1000);
  
  // Calculate mock analytics
  const totalUsers = MOCK_USERS.length;
  const totalStudents = MOCK_USERS.filter(user => user.role === 'student').length;
  const totalClubs = MOCK_USERS.filter(user => user.role === 'club').length;
  const totalAdmins = MOCK_USERS.filter(user => user.role === 'admin').length;
  
  // Mock values
  const newUsersThisMonth = 15;
  const activeUsers = Math.floor(totalUsers * 0.8);
  
  // Department distribution
  const departments = [...new Set(MOCK_USERS.filter(user => user.department).map(user => user.department))];
  const departmentDistribution = departments.map(dept => ({
    name: dept,
    count: MOCK_USERS.filter(user => user.department === dept).length,
  }));

// Monthly distribution (mock data)
const monthlyRegistrations = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 18 },
  { month: 'Mar', count: 25 },
  { month: 'Apr', count: 15 },
  { month: 'May', count: 10 },
  { month: 'Jun', count: 8 },
  { month: 'Jul', count: 12 },
  { month: 'Aug', count: 20 },
  { month: 'Sep', count: 30 },
  { month: 'Oct', count: 22 },
  { month: 'Nov', count: 18 },
  { month: 'Dec', count: 15 },
];

return {
  totalUsers,
  totalStudents,
  totalClubs,
  totalAdmins,
  newUsersThisMonth,
  activeUsers,
  departmentDistribution,
  monthlyRegistrations,
};
};

// Full Mock Data Export
export const getMockData = () => ({
  events: MOCK_EVENTS,
  clubs: MOCK_CLUBS,
  users: MOCK_USERS,
  departments: MOCK_DEPARTMENTS
});