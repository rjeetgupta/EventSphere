import { Link } from 'react-router-dom';
import { Calendar, Mail, Github, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CampusEvents</span>
            </div>
            <p className="text-muted-foreground text-sm">
              The ultimate platform for managing and discovering campus events and activities.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-foreground text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground text-sm">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground text-sm">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-muted-foreground hover:text-foreground text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>support@campusevents.com</span>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} CampusEvents. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;