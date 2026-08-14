import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginCustomer, registerCustomer, loginAdmin } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('sdkas_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error loading user session', e);
      return null;
    }
  });

  const saveUserSession = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('sdkas_user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('sdkas_user');
    }
  };

  // Customer Login Handler
  const handleCustomerLogin = async ({ emailOrMobile, password }) => {
    const res = await loginCustomer({ emailOrMobile, password });
    if (res.success && res.user) {
      saveUserSession({ ...res.user, role: 'customer' });
      return res.user;
    }
    throw new Error(res.message || 'Login failed');
  };

  // Customer Register Handler
  const handleCustomerRegister = async ({ name, emailOrMobile, password, address }) => {
    const res = await registerCustomer({ name, emailOrMobile, password, address });
    if (res.success && res.user) {
      saveUserSession({ ...res.user, role: 'customer' });
      return res.user;
    }
    throw new Error(res.message || 'Registration failed');
  };

  // Admin Login Handler
  const handleAdminLogin = async ({ emailOrMobile, password }) => {
    const res = await loginAdmin({ emailOrMobile, password });
    if (res.success && res.user) {
      localStorage.setItem('sdkas_admin_pass', password);
      saveUserSession({ ...res.user, role: 'admin' });
      return res.user;
    }
    throw new Error(res.message || 'Admin login failed');
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('sdkas_user');
    localStorage.removeItem('sdkas_admin_pass');
    setUser(null);
  };

  const isCustomer = user && user.role === 'customer';
  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      isCustomer,
      isAdmin,
      customerLogin: handleCustomerLogin,
      customerRegister: handleCustomerRegister,
      adminLogin: handleAdminLogin,
      logout: handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
