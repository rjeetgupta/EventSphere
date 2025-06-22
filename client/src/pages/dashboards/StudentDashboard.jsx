import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, BookOpen, Loader2 } from 'lucide-react';
import apiClient from '@/services/apiClient';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    upcomingRegisteredEvents: 0,
    memberClubs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/dashboard/student');
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch student stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  const statsCards = [
    {
      title: 'Upcoming Events',
      value: stats.upcomingRegisteredEvents,
      description: "Events you're registered for",
      icon: Calendar,
    },
    {
      title: 'My Clubs',
      value: stats.memberClubs,
      description: "Clubs you're a member of",
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-5 bg-gray-200 rounded w-24"></div>
                <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-12 mt-1"></div>
                <div className="h-4 bg-gray-200 rounded w-32 mt-2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map(stat => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard; 