'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/services/api';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Try to fetch profile on load
    api.get('/auth/profile').then(res => setUser(res.data.user)).catch(() => {});
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    localStorage.setItem('accessToken', res.data.accessToken);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    // Return safe defaults during Server-Side Rendering (SSR)
    return { user: null, login: async () => {}, logout: async () => {} };
  }
  return context;
};