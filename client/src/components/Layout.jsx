import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Layout = () => {
  const { user, loading } = useAuth();
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className={`transition-opacity duration-300 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <Outlet />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;