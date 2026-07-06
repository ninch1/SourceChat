import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoadingScreen from '../layout/AuthLoadingScreen';

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  if (!user) {
    return <Navigate to='/login' />;
  }

  return children;
}
