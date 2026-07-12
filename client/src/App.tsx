import { Route, Routes } from 'react-router-dom';

import HeroPage from './pages/HeroPage';

import LoginPage from './pages/LoginPage';

import RegisterPage from './pages/RegisterPage';

import DashboardPage from './pages/DashboardPage';

import { useEffect } from 'react';

import { refreshAccessToken, getCurrentUser } from './api/authApi';

import { useAuth } from './context/AuthContext';

import ProtectedRoute from './components/routes/ProtectedRoute';

import PublicRoute from './components/routes/PublicRoute';

import IndexRoute from './components/routes/IndexRoute';

import type { User } from './types/auth';

type RestoredSession = { user: User; accessToken: string };

let restoreAuthSessionPromise: Promise<RestoredSession> | null = null;

async function restoreAuthSession(): Promise<RestoredSession> {
  if (!restoreAuthSessionPromise) {
    restoreAuthSessionPromise = (async () => {
      const accessToken = await refreshAccessToken();
      const user = await getCurrentUser(accessToken);
      return { user, accessToken };
    })();

    // Allow a future app startup/manual restore attempt to try again.
    restoreAuthSessionPromise.finally(() => {
      restoreAuthSessionPromise = null;
    });
  }

  return restoreAuthSessionPromise;
}

export default function App() {
  const { setAuth, clearAuth } = useAuth();

  // One-time session restore on mount. Route guards handle redirects.

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const restored = await restoreAuthSession();
        if (cancelled) return;
        setAuth(restored);
      } catch {
        if (!cancelled) {
          clearAuth();
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };

    // This is an app-startup initializer. It should run once on mount only.
    // Route guards handle redirects after auth state settles.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Routes>
      <Route path='/' element={<IndexRoute />} />

      <Route path='/welcome' element={<HeroPage />} />

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
