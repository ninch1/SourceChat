import { Route, Routes } from 'react-router-dom';
import HeroPage from './pages/HeroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { useEffect } from 'react';
import { useRefreshAccessToken, useGetCurrentUser } from './queries/auth';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRotue';

export default function App() {
  const { setAuth, clearAuth } = useAuth();

  const {
    mutate: refreshAccessTokenMutation,
    data: accessToken,
    isError: isRefreshError,
  } = useRefreshAccessToken();

  const { data: currentUser } = useGetCurrentUser(accessToken ?? null);

  // On app startup, try to use the refresh-token cookie to get a new access token.
  // This should restore the session after a page refresh.
  useEffect(() => {
    refreshAccessTokenMutation();
  }, [refreshAccessTokenMutation]);

  // If refresh fails, treat the user as logged out and clear any auth state in memory.
  useEffect(() => {
    if (isRefreshError) {
      clearAuth();
    }
  }, [isRefreshError, clearAuth]);

  // Once refresh gives us an access token, use it to fetch the current user.
  // When both are available, restore the full auth state in context.
  useEffect(() => {
    if (!accessToken || !currentUser) return;

    setAuth({
      user: currentUser,
      accessToken,
    });
  }, [accessToken, currentUser, setAuth]);

  return (
    <Routes>
      <Route
        path='/'
        element={
          <PublicRoute>
            <HeroPage />
          </PublicRoute>
        }
      />
      <Route
        path='/login'
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path='/register'
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
