import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
}
