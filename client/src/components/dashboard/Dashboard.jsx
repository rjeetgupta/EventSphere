import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const renderDashboardContent = () => {
    switch (user.role) {
      case 'SuperAdmin':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Super Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Invite Admin</h3>
                <button
                  onClick={() => navigate('/admin/invite')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Send Invite
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Manage Admins</h3>
                <button
                  onClick={() => navigate('/admin/manage')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  View Admins
                </button>
              </div>
            </div>
          </div>
        );

      case 'Admin':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Manage Club</h3>
                <button
                  onClick={() => navigate('/admin/club')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  View Club
                </button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Invite Students</h3>
                <button
                  onClick={() => navigate('/admin/invite-students')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Send Invites
                </button>
              </div>
            </div>
          </div>
        );

      case 'Student':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Student Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">My Club</h3>
                <p className="text-gray-600">View your club information and events</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                <p className="text-gray-600">Check out upcoming club events</p>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {renderDashboardContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 