import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLoadingScreen from '../ui/AuthLoadingScreen';

export default function IndexRoute() {
  const { user, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  if (user) {
    return <Navigate to='/dashboard' replace />;
  }

  return <Navigate to='/welcome' replace />;
}
