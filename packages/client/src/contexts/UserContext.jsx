import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getAuthUser } from '../api/spotify';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuthUser()
      .then((profile) => {
        setUser(profile);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data || err.message);
        setLoading(false);
      });
  }, []);

  const login = useCallback(() => {
    window.location.assign('/api/auth/spotify');
  }, []);

  const logout = useCallback(() => {
    window.location.assign('/api/auth/user/logout');
  }, []);

  const value = useMemo(
    () => ({ user, loading, error, login, logout }),
    [user, loading, error, login, logout],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
