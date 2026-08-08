import { createContext, useContext, useEffect, useState } from 'react';
import { clearToken, getToken, setToken } from '../services/api';
import * as auth from '../services/authService';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => { (async () => { if (!getToken()) return setAuthLoading(false); try { setCurrentUser((await auth.getMe()).user); } catch { clearToken(); } finally { setAuthLoading(false); } })(); }, []);
  const authenticate = async (method, values) => { const result = await auth[method](values); setToken(result.token); setCurrentUser(result.user); return result; };
  const logout = () => { clearToken(); setCurrentUser(null); };
  return <AuthContext.Provider value={{ currentUser, authLoading, isAuthenticated: Boolean(currentUser), authenticate, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
