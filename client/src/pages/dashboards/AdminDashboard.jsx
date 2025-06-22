import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Building2, BarChart3, Plus, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AssignManagerModal from '@/components/admin/AssignManagerModal';
import apiClient from '@/services/apiClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    completedEvents: 0,
    totalClubs: 0,
    totalRegistrations: 0,
  });
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/dashboard/admin');
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: Calendar,
      color: 'bg-green-500'
    },
    {
      title: 'Completed Events',
      value: stats.completedEvents,
      icon: CheckCircle,
      color: 'bg-teal-500'
    },
    {
      title: 'Total Clubs',
      value: stats.totalClubs,
      icon: Building2,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations,
      icon: BarChart3,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-400">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="default" className="bg-indigo-600 hover:bg-indigo-700">
            <Link to="/clubs/create-club">
              <Plus className="h-4 w-4 mr-2" />
              Create Club
            </Link>
          </Button>
          <Button asChild variant="default" className="bg-green-600 hover:bg-green-700">
            <Link to="/events/create-event">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={() => setAssignModalOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            Assign Manager
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ))
        ) : (
          statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {/* Add your recent activity items here */}
          <p className="text-gray-600">No recent activity to display</p>
        </div>
      </div>
      <AssignManagerModal open={assignModalOpen} onClose={() => setAssignModalOpen(false)} />
    </div>
  );
};

export default AdminDashboard; 