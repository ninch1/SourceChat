import { Route, Routes } from 'react-router-dom';
import HeroPage from './pages/HeroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { useEffect, useRef } from 'react';
import { useRefreshAccessToken, useGetCurrentUser } from './queries/auth';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/routes/ProtectedRoute';
import PublicRoute from './components/routes/PublicRoute';

export default function App() {
  const hasTriedRefresh = useRef(false);
  const { setAuth, clearAuth } = useAuth();

  const {
    mutate: refreshAccessTokenMutation,
    data: accessToken,
    isError: isRefreshError,
    isSuccess: isRefreshSuccess,
  } = useRefreshAccessToken();

  const { data: currentUser, isError: isCurrentUserError } = useGetCurrentUser(
    accessToken ?? null,
  );

  // On app startup, try to restore the session from the refresh-token cookie.
  useEffect(() => {
    if (hasTriedRefresh.current) return;

    hasTriedRefresh.current = true;

    let cancelled = false;

    refreshAccessTokenMutation(undefined, {
      onError: () => {
        if (!cancelled) {
          clearAuth();
        }
      },
    });

    // Strict Mode remounts the tree; reset so the new mount can retry refresh.
    return () => {
      cancelled = true;
      hasTriedRefresh.current = false;
    };
  }, [refreshAccessTokenMutation, clearAuth]);

  // Fallback when mutate onError does not run (e.g. after Strict Mode remount).
  useEffect(() => {
    if (isRefreshError) {
      clearAuth();
    }
  }, [isRefreshError, clearAuth]);

  // Refresh succeeded but returned no token — treat as logged out.
  useEffect(() => {
    if (isRefreshSuccess && !accessToken) {
      clearAuth();
    }
  }, [isRefreshSuccess, accessToken, clearAuth]);

  // If refresh succeeded but /auth/me fails, treat the user as logged out.
  useEffect(() => {
    if (isCurrentUserError) {
      clearAuth();
    }
  }, [isCurrentUserError, clearAuth]);

  // Once we have both the access token and current user, restore auth state.
  useEffect(() => {
    if (!accessToken || !currentUser) return;

    setAuth({
      user: currentUser,
      accessToken,
    });
  }, [accessToken, currentUser, setAuth]);

  return (
    <Routes>
      <Route path='/' element={<HeroPage />} />

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
