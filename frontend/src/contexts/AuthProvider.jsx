import { useState } from 'react';
import AuthContext from './AuthContextDefinition';
import { login as loginService } from '../services/authService';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const role = localStorage.getItem('role');

    return token
      ? {
          token,
          name,
          role
        }
      : null;
  });

  const login = async (email, password) => {
    const data = await loginService(email, password);

    localStorage.setItem('token', data.token);
    localStorage.setItem('name', data.name);
    localStorage.setItem('role', data.role);

    setUser({
      token: data.token,
      name: data.name,
      role: data.role
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
