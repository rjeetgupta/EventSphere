import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '@/store/authSlice';
import { ROLES } from '@/constants/authConstants';

/**
 * AuthGuard component prevents authenticated users from accessing auth pages
 * and redirects them to their appropriate dashboard based on their role
 */
const AuthGuard = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  if (isAuthenticated && user) {
    // Redirect based on user role
    const redirectPath = user.role === ROLES.STUDENT
      ? '/dashboard'
      : user.role === ROLES.CLUB_MANAGER
      ? '/club/dashboard'
      : '/admin/dashboard';
    
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthGuard; 