import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, BarChart2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import apiClient from '@/services/apiClient';

const ClubDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    clubName: '',
    totalEvents: 0,
    activeEvents: 0,
    totalMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/dashboard/club');
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch club stats:', error);
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
      title: 'Total Events',
      value: stats.totalEvents,
      description: 'Events created',
      icon: Calendar,
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      description: 'Upcoming events',
      icon: Calendar,
    },
    {
      title: 'Total Members',
      value: stats.totalMembers,
      description: 'Club members',
      icon: Users,
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 bg-gray-200 rounded w-64"></div>
          <div className="h-10 bg-gray-200 rounded w-36"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{stats.clubName} Dashboard</h1>
        <Button asChild>
          <Link to="/events/create-event">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Registrations</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Coming Soon</div>
            <p className="text-xs text-muted-foreground">
              Total registrations for events
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubDashboard; 