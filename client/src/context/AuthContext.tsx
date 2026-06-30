import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/auth';

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

type AuthContextValue = AuthState & {
  setAuth: (authState: AuthState) => void;
  clearAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    accessToken: null,
  });

  function setAuth(authState: AuthState) {
    setAuthState(authState);
  }

  function clearAuth() {
    setAuthState({
      user: null,
      accessToken: null,
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        accessToken: authState.accessToken,
        setAuth,
        clearAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}