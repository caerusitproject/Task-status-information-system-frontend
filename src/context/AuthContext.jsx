// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

 const login = async (email, password) => {
  try {
    setLoading(true);
    setError(null);

    // === REMOVE ALL API CALLS ===
    // Simulate login with any credentials
    const dummyUser = {
      id: 999,
      email: email,
      name: email,
      role: "ADMIN", // or "HR", "MANAGER", "USER"
      roles: ["ADMIN"],
      empCode: "EMP9999",
      departmentId: 1,
      designation: "Software Engineer",
      mobile: "+919876543210",
      phone: "+919876543210",
      loginTime: new Date().toISOString(),
    };

    setIsAuthenticated(true);
    setUser(dummyUser);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(dummyUser));

    setLoading(false);
    return true;
  } catch (error) {
    setError('Login failed');
    setLoading(false);
    return false;
  }
};

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.clear();
  };

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('user');

    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Updated context value to include setters
  const value = {
    isAuthenticated,
    setIsAuthenticated, // Add this
    user,
    setUser, // Add this
    login,
    logout,
    loading,
    setLoading, // Add this (optional, if needed elsewhere)
    error,
    setError, // Add this
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};