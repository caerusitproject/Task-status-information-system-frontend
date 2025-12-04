// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { LoginRegisterApi } from "../../src/api/loginRegisterApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("tsis_isAuthenticated") === "true";
  });
  const savedUser = localStorage.getItem("user");

  const [user, setUser] = useState(() => {
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      setIsAuthenticated(true);
      setUser(userData);
      localStorage.setItem("tsis_isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));

      setLoading(false);
      return true;
    } catch (error) {
      setError("Login failed");
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    //console.log("logout__", JSON.parse(savedUser)?.email);
    await LoginRegisterApi.logoutUser(JSON.parse(savedUser)?.email); // Call logout API
    localStorage.clear();
  };

  useEffect(() => {
    const authStatus = localStorage.getItem("tsis_isAuthenticated");
    const userData = localStorage.getItem("user");

    if (authStatus === "true" && userData) {
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
