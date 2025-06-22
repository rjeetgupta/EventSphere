import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'sonner';
import { ROLES } from '@/constants/authConstants';
import { selectCurrentUser, selectIsAuthenticated, loadUserFromToken } from '@/store/authSlice';
import { useEffect } from 'react';

// Layouts
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ClubLayout from '@/components/layout/ClubLayout';

// Auth Pages
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';

// Public Pages
import HomePage from '@/pages/HomePage';
import Events from '@/pages/Events';
import EventDetails from '@/pages/events/EventDetails';
import Clubs from '@/pages/clubs/Clubs';
import ClubDetails from '@/pages/clubs/ClubDetails';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';
import CreateClub from '@/pages/clubs/CreateClub';
import CreateEvent from '@/pages/events/CreateEvent';

// Student Pages
import StudentDashboard from '@/pages/dashboards/StudentDashboard';
import Profile from '@/pages/Profile';

// Admin Pages
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import AdminClubsPage from '@/pages/admin/Clubs';

// Club Manager Pages
import ClubDashboard from '@/pages/dashboards/ClubDashboard';
import ClubEvents from '@/pages/club/Events';
import ClubAnalytics from '@/pages/club/Analytics';
import ClubManagement from '@/pages/club/Management';
import EditEvent from '@/pages/club/EditEvent';

// Components
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AuthGuard from '@/components/auth/AuthGuard';

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Create Club/Event for Admin/SuperAdmin */}
          <Route
            path="/clubs/create-club"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
                <CreateClub />
              </ProtectedRoute>
            }
          />
          {/* Create event for Admin/SuperAdmin/clubManager */}
          <Route
            path="/events/create-event"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CLUB_MANAGER]}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <AuthGuard>
                <Login />
              </AuthGuard>
            }
          />
          <Route
            path="/register"
            element={
              <AuthGuard>
                <Register />
              </AuthGuard>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthGuard>
                <ForgotPassword />
              </AuthGuard>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Club Manager Routes */}
        <Route
          element={
            <ProtectedRoute allowedRoles={[ROLES.CLUB_MANAGER]}>
              <ClubLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/club/dashboard" element={<ClubDashboard />} />
          <Route path="/club/events" element={<ClubEvents />} />
          <Route path="/club/events/create" element={<CreateEvent />} />
          <Route path="/club/events/:id/edit" element={<EditEvent />} />
          <Route path="/club/analytics" element={<ClubAnalytics />} />
          <Route path="/club/management" element={<ClubManagement />} />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;