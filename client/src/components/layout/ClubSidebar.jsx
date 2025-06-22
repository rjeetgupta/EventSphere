import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Settings,
  Users,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/authSlice';

const ClubSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const navItems = [
    {
      title: 'Dashboard',
      href: '/club/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Events',
      href: '/club/events',
      icon: Calendar
    },
    {
      title: 'Analytics',
      href: '/club/analytics',
      icon: BarChart3
    },
    {
      title: 'Management',
      href: '/club/management',
      icon: Users
    },
    {
      title: 'Settings',
      href: '/club/settings',
      icon: Settings
    }
  ];

  const handleLogout = () => {
    dispatch(logout());
    toast.success("You have logout successfully")
  };

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/club/dashboard" className="flex items-center gap-2 font-semibold">
          <span>Club Manager</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                location.pathname === item.href && 'bg-muted text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ClubSidebar; 