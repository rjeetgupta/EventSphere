import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Menu, User, X } from 'lucide-react';
import { logout } from '@/store/authSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { ROLE_ROUTES } from '@/constants/authConstants';

// ✅ Centralized nav links
const navLinks = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Clubs", to: "/clubs" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, user, role } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout(role));
    toast.success("You have logout successfully")
    setIsMobileMenuOpen(false);
  };

  const renderLinks = (isMobile = false) =>
    navLinks.map((link) => (
      <Link
        key={link.label}
        to={link.to}
        onClick={() => isMobile && setIsMobileMenuOpen(false)}
        className={`${
          isMobile
            ? "block px-4 py-2 text-sm"
            : "text-sm"
        } font-medium text-muted-foreground hover:text-primary transition-colors`}
      >
        {link.label}
      </Link>
    ));

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Hamburger */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="text-2xl font-bold text-primary">
              Campus Event
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden ml-auto"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            {renderLinks()}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-events">My Events</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={user ? ROLE_ROUTES[user.role] : '/dashboard'}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-4">
            {renderLinks(true)}

            <div className="px-4">
              <ThemeToggle />
            </div>

            {isAuthenticated ? (
              <div className="px-4 space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Profile
                </Link>
                <Link
                  to="/my-events"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  My Events
                </Link>
                <Link
                  to={user ? ROLE_ROUTES[user.role] : '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block text-left w-full text-sm font-medium text-muted-foreground hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
