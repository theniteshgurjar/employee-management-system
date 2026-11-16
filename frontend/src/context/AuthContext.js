import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('ems_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ems_token') || null);
  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password });
      const data = response.data.data;

      const userProfile = {
        id: data.id,
        username: data.username,
        email: data.email,
        roles: data.roles,
        employeeId: data.employeeId,
        firstName: data.firstName,
        lastName: data.lastName,
      };

      setToken(data.token);
      setUser(userProfile);
      localStorage.setItem('ems_token', data.token);
      localStorage.setItem('ems_user', JSON.stringify(userProfile));

      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Invalid username or password';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
  };

  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    const target = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
    return user.roles.includes(target);
  };

  const hasAnyRole = (allowedRoles) => {
    if (!user || !user.roles) return false;
    return allowedRoles.some((role) => hasRole(role));
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        hasRole,
        hasAnyRole,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
