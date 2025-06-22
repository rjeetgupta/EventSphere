import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

const AdminRoute = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 