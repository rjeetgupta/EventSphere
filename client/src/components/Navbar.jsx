import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Moon, 
  Sun, 
  Users,
  BarChart2,
  Shield 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthProvider';
import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
  ];

  const renderAuthButtons = () => {
    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            
            {user.role === 'admin' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Admin</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/events')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/users')}>
                  <Users className="mr-2 h-4 w-4" />
                  Users
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/analytics')}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Analytics
                </DropdownMenuItem>
              </>
            )}
            
            {user.role === 'club' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Club</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => navigate('/club')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/club/events')}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Events
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/club/analytics')}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Analytics
                </DropdownMenuItem>
              </>
            )}
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate('/login')}>
          Log in
        </Button>
        <Button onClick={() => navigate('/register')}>Sign up</Button>
      </div>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b" : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">CampusEvents</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="mr-2"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <div className="hidden md:block">{renderAuthButtons()}</div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary py-2",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="mt-2 pt-4 border-t">
              {user ? (
                <>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    
                    {user.role === 'admin' && (
                      <>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate('/admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </>
                    )}
                    
                    {user.role === 'club' && (
                      <>
                        <Button variant="ghost" className="justify-start" onClick={() => navigate('/club')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Club Dashboard
                        </Button>
                      </>
                    )}
                    
                    <Button variant="ghost" className="justify-start" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="w-full" onClick={() => navigate('/login')}>
                    Log in
                  </Button>
                  <Button className="w-full" onClick={() => navigate('/register')}>
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;