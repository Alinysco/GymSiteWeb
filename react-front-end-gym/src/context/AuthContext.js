import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, rehydrate user from token
  useEffect(() => {
    const token = localStorage.getItem('ft_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.me()
      .then(data => setCurrentUser(data.user))
      .catch(() => {
        localStorage.removeItem('ft_token');
        setCurrentUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    localStorage.setItem('ft_token', data.token);
    setCurrentUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password, password_confirmation) => {
    const data = await api.register(name, email, password, password_confirmation);
    localStorage.setItem('ft_token', data.token);
    setCurrentUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await api.logout(); } catch (_) {}
    localStorage.removeItem('ft_token');
    setCurrentUser(null);
  }, []);
  
  const updateProfile = useCallback(async (name,email,password,password_confirmation) => {
    const data = await api.updateProfile(name, email, password, password_confirmation);
    setCurrentUser(data.user);
    return data.user;
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await api.me();
    setCurrentUser(data.user);
    return data.user;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, refreshUser, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}