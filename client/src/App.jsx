import { useState } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/contexts/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailsPage';
import AdminDashboardPage from '@/pages/admin/dashboard';
import AdminEventsPage from '@/pages/admin/events';
import AdminUsersPage from '@/pages/admin/users';
import AdminClubsPage from '@/pages/admin/clubs';
import AdminAnalyticsPage from '@/pages/admin/analytics';
import ClubDashboardPage from '@/pages/club/dashboard';
import ClubEventsPage from '@/pages/club/events';
import ClubAnalyticsPage from '@/pages/club/analytics';
import UserProfilePage from '@/pages/ProfilePage';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';

function App() {
  return (
    <>
      <Toaster />
      <ThemeProvider defaultTheme="light" storageKey="campus-events-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="events" element={<EventsPage />} />
                <Route path="events/:id" element={<EventDetailPage />} />
                <Route path="profile" element={
                  <ProtectedRoute allowedRoles={['admin', 'club', 'student']}>
                    <UserProfilePage />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="admin/events" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminEventsPage />
                  </ProtectedRoute>
                } />
                <Route path="admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                } />
                <Route path="admin/clubs" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminClubsPage />
                  </ProtectedRoute>
                } />
                <Route path="admin/analytics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAnalyticsPage />
                  </ProtectedRoute>
                } />

                {/* Club Routes */}
                <Route path="club" element={
                  <ProtectedRoute allowedRoles={['club']}>
                    <ClubDashboardPage />
                  </ProtectedRoute>
                } />
                <Route path="club/events" element={
                  <ProtectedRoute allowedRoles={['club']}>
                    <ClubEventsPage />
                  </ProtectedRoute>
                } />
                <Route path="club/analytics" element={
                  <ProtectedRoute allowedRoles={['club']}>
                    <ClubAnalyticsPage />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;