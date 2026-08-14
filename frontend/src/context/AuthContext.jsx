import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginCustomer as apiLoginCustomer,
  registerCustomer as apiRegisterCustomer,
  loginAdmin as apiLoginAdmin,
  changeAdminPassword as apiChangeAdminPassword,
  updateCustomerProfile as apiUpdateCustomerProfile
} from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Independent Customer State
  const [customerUser, setCustomerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('customer_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [customerToken, setCustomerToken] = useState(() => {
    return localStorage.getItem('customer_token') || null;
  });

  // Independent Admin State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [adminToken, setAdminToken] = useState(() => {
    return localStorage.getItem('admin_token') || null;
  });

  // Customer Actions
  const customerRegister = async ({ name, mobile, password, address }) => {
    const res = await apiRegisterCustomer({ name, mobile, password, address });
    if (res.token && res.user) {
      localStorage.setItem('customer_token', res.token);
      localStorage.setItem('customer_user', JSON.stringify(res.user));
      setCustomerToken(res.token);
      setCustomerUser(res.user);
    }
    return res;
  };

  const customerLogin = async ({ mobile, password }) => {
    const res = await apiLoginCustomer({ mobile, password });
    if (res.token && res.user) {
      localStorage.setItem('customer_token', res.token);
      localStorage.setItem('customer_user', JSON.stringify(res.user));
      setCustomerToken(res.token);
      setCustomerUser(res.user);
    }
    return res;
  };

  const logoutCustomer = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_user');
    setCustomerToken(null);
    setCustomerUser(null);
  };

  const updateCustomerAddress = async (newAddress) => {
    const res = await apiUpdateCustomerProfile({ address: newAddress });
    if (res.user) {
      localStorage.setItem('customer_user', JSON.stringify(res.user));
      setCustomerUser(res.user);
    }
    return res;
  };

  // Admin Actions
  const adminLogin = async ({ mobile, password }) => {
    const res = await apiLoginAdmin({ mobile, password });
    if (res.token && res.user) {
      localStorage.setItem('admin_token', res.token);
      localStorage.setItem('admin_user', JSON.stringify(res.user));
      setAdminToken(res.token);
      setAdminUser(res.user);
    }
    return res;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('sdkas_admin_pass');
    setAdminToken(null);
    setAdminUser(null);
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    return await apiChangeAdminPassword({ currentPassword, newPassword });
  };

  return (
    <AuthContext.Provider value={{
      // Customer
      customerUser,
      customerToken,
      isCustomerLoggedIn: Boolean(customerToken && customerUser),
      customerRegister,
      customerLogin,
      logoutCustomer,
      updateCustomerAddress,

      // Admin
      adminUser,
      adminToken,
      isAdminLoggedIn: Boolean(adminToken && adminUser),
      adminLogin,
      logoutAdmin,
      changePassword
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
