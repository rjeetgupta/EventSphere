import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, Calendar, Settings, Shield, Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice';
import { toast } from 'sonner';

const SuperAdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('You have logout successfully');
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. You have full access to all features.
          </p>
        </div>
        <div className="flex gap-2 items-center">
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
          <Button variant="outline" onClick={handleLogout} className="ml-2">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* System Overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Across all roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clubs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Active clubs in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Events across all clubs
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* System Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage all users, roles, and permissions
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">System Configuration</h3>
              <p className="text-sm text-muted-foreground">
                Configure system settings and defaults
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Audit Logs</h3>
              <p className="text-sm text-muted-foreground">
                View system activity and changes
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Server Status</h3>
              <p className="text-sm text-muted-foreground">
                Monitor server performance and health
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Database Status</h3>
              <p className="text-sm text-muted-foreground">
                Check database connections and performance
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">API Status</h3>
              <p className="text-sm text-muted-foreground">
                Monitor API endpoints and response times
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 