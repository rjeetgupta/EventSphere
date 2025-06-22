import { Outlet } from 'react-router-dom';
import ClubSidebar from '@/components/layout/ClubSidebar';

const ClubLayout = () => {
  return (
    <div className="min-h-screen flex">
      <ClubSidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default ClubLayout; 