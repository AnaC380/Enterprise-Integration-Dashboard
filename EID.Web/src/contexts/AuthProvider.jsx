import { useCallback, useEffect, useState } from 'react';
import AuthContext from './AuthContextDefinition';
import {
  login as loginService,
  register as registerService
} from '../services/authService';
import { getTokenExpiry } from '../lib/jwt';

const KEYS = ['token', 'name', 'email', 'role'];

function clearSession() {
  KEYS.forEach((key) => localStorage.removeItem(key));
}

function readSession() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const expiresAt = getTokenExpiry(token);
  if (!expiresAt || expiresAt <= Date.now()) {
    clearSession();
    return null;
  }

  return {
    token,
    name: localStorage.getItem('name'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
    expiresAt
  };
}

function persistSession(data) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('name', data.name);
  localStorage.setItem('email', data.email);
  localStorage.setItem('role', data.role);

  return { ...data, expiresAt: getTokenExpiry(data.token) };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);
  const [notice, setNotice] = useState(null);

  const expire = useCallback(() => {
    clearSession();
    setUser(null);
    setNotice('expired');
  }, []);

  // 401 vindo da API (token inválido ou expirado) encerra a sessão.
  useEffect(() => {
    window.addEventListener('eid:unauthorized', expire);
    return () => window.removeEventListener('eid:unauthorized', expire);
  }, [expire]);

  // Encerra a sessão no instante em que o JWT expira (8h na configuração da API).
  useEffect(() => {
    if (!user?.expiresAt) return undefined;
    const timer = setTimeout(expire, Math.max(user.expiresAt - Date.now(), 0));
    return () => clearTimeout(timer);
  }, [user, expire]);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    setNotice(null);
    setUser(persistSession(data));
  };

  const register = async (name, email, password) => {
    const data = await registerService(name, email, password);
    setNotice(null);
    setUser(persistSession(data));
  };

  const logout = () => {
    clearSession();
    setNotice(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, notice, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
