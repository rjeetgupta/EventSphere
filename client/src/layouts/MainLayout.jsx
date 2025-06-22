import { Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import Navbar from '@/components/navbar/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'sonner';

const MainLayout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      {!isAuthPage && <Footer />}
      <Toaster position="top-right" />
    </div>
  );
};

export default MainLayout; 