import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth';

// The actual auth data we keep in memory for the current browser tab.
type AuthState = {
  user: User | null;
  accessToken: string | null;

  // True while the app is checking whether the refresh-token cookie
  // can restore a logged-in session after page refresh.
  isAuthLoading: boolean;
};

// Data needed when login/session restore succeeds.
// We do not include isAuthLoading here because setAuth handles that internally.
type SetAuthData = {
  user: User;
  accessToken: string;
};

// The full value that components receive when they call useAuth().
// It includes both auth state and functions that can update that state.
type AuthContextValue = AuthState & {
  setAuth: (authData: SetAuthData) => void;
  clearAuth: () => void;
};

// Starts as null because outside AuthProvider there is no auth context available.
const AuthContext = createContext<AuthContextValue | null>(null);

// Provides auth state to the entire app.
// Any component inside this provider can call useAuth().
export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,

    // Start true because on initial app load we have not checked /auth/refresh yet.
    isAuthLoading: true,
  });

  // Called after login succeeds or after refresh + /auth/me restores the session.
  // Setting auth also means the auth check is finished.
  function setAuth(authData: SetAuthData) {
    setAuthState({
      user: authData.user,
      accessToken: authData.accessToken,
      isAuthLoading: false,
    });
  }

  // Called after logout or failed refresh.
  // Clearing auth also means the auth check is finished.
  function clearAuth() {
    setAuthState({
      user: null,
      accessToken: null,
      isAuthLoading: false,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        accessToken: authState.accessToken,
        isAuthLoading: authState.isAuthLoading,
        setAuth,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Safer helper so components do not use useContext(AuthContext) directly.
// If a component tries to use auth outside AuthProvider, this gives a clear error.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
