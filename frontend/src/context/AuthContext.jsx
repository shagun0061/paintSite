import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { setUnauthorizedHandler } from '../services/api.js';
import { fetchMe, login as apiLogin, logout as apiLogout } from '../services/endpoints.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchMe({ signal: controller.signal })
      .then(({ user: me }) => setUser(me))
      .catch(() => {})
      .finally(() => !controller.signal.aborted && setChecking(false));
    return () => controller.abort();
  }, []);

  // A 401 from any admin call means the session expired: drop back to the login page.
  useEffect(() => setUnauthorizedHandler(() => setUser(null)), []);

  const login = useCallback(async (credentials) => {
    const { user: me } = await apiLogin(credentials);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, checking, login, logout, isAdmin: user?.role === 'admin' }), [user, checking, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
