import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-card border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-foreground text-lg font-semibold">Campus Event</h3>
            <p className="text-muted-foreground text-sm">
              Your one-stop platform for managing and discovering college events. Connect, learn, and celebrate with your college community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/events" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Browse Events
                </Link>
              </li>
              <li>
                <Link to="/create-event" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Create Event
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-foreground text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-foreground text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 text-sm text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} EventSphere. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
