import { Link } from 'react-router-dom';
import { Calendar, Mail, Github, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/events", label: "Events" },
    { to: "/login", label: "Login" },
    { to: "/register", label: "Register" }
  ];

  const resources = [
    { to: "#", label: "Help Center" },
    { to: "#", label: "Terms of Service" },
    { to: "#", label: "Privacy Policy" },
    { to: "#", label: "FAQ" }
  ];

  const socialLinks = [
    { href: "#", icon: <Twitter className="h-6 w-6 text-white hover:text-indigo-400" />, label: "Twitter" },
    { href: "#", icon: <Instagram className="h-6 w-6 text-white hover:text-indigo-400" />, label: "Instagram" },
    { href: "#", icon: <Github className="h-6 w-6 text-white hover:text-indigo-400" />, label: "GitHub" }
  ];

  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container mx-auto px-6">
        {/* Footer Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1st Column - CampusEvents */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-8 w-8 text-indigo-400" />
              <span className="text-3xl font-semibold text-white">CampusEvents</span>
            </div>
            <p className="text-lg text-neutral-400">
              Discover, participate, and manage campus events and activities with ease. Stay updated with the latest happenings!
            </p>
          </div>

          {/* 2nd Column - Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.to} className="text-neutral-400 hover:text-indigo-400 transition-colors duration-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3rd Column - Resources */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Resources</h3>
            <ul className="space-y-2">
              {resources.map((resource, index) => (
                <li key={index}>
                  <Link to={resource.to} className="text-neutral-400 hover:text-indigo-400 transition-colors duration-300">
                    {resource.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4th Column - Follow Us & Contact */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex gap-6 mb-6">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} className="hover:text-indigo-400 transition-all duration-300">
                  {social.icon}
                </a>
              ))}
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Contact</h3>
            <div className="flex items-center gap-2 text-neutral-400 text-sm">
              <Mail className="h-4 w-4" />
              <span>support@campusevents.com</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section - Copyright and Legal Links */}
        <div className="border-t mt-14 border-neutral-700 pt-6 text-center flex justify-between">
          <p className="text-md text-neutral-400">
            © {new Date().getFullYear()} CampusEvents. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-4">
            <Link to="#" className="text-md text-neutral-400 hover:text-indigo-400 transition-colors duration-300">
              Privacy
            </Link>
            <Link to="#" className="text-md text-neutral-400 hover:text-indigo-400 transition-colors duration-300">
              Terms
            </Link>
            <Link to="#" className="text-md text-neutral-400 hover:text-indigo-400 transition-colors duration-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
