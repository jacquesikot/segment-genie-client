import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-context';
import { LoadingSpinner } from '../main';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <>{children}</> : <Navigate to="/sign-in" replace />;
};

export default ProtectedRoute;
