import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { getAuthUser } from '../api/spotify';
import type { UserProfile } from '../types';

interface UserContextValue {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAuthUser()
      .then((profile) => {
        setUser(profile);
        setLoading(false);
      })
      .catch((err: { response?: { data?: unknown }; message?: string }) => {
        const data = err.response?.data;
        const message = typeof data === 'string' ? data : err.message || 'Unknown error';
        setError(message);
        setLoading(false);
      });
  }, []);

  const login = useCallback((): void => {
    window.location.assign('/api/auth/spotify');
  }, []);

  const logout = useCallback((): void => {
    window.location.assign('/api/auth/user/logout');
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ user, loading, error, login, logout }),
    [user, loading, error, login, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
