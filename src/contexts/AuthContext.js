"use client";

import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // React Compiler automatically memoizes these functions - no manual useCallback needed
  const clearError = () => setError(null);

  const validateToken = async () => {
    try {
      const token = localStorage.getItem("expenseTrackerToken");
      if (!token) {
        setUser(null);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("expenseTrackerToken");
        setUser(null);
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      localStorage.removeItem("expenseTrackerToken");
      setUser(null);
    }
  };

  // Check token on mount
  useEffect(() => {
    setLoading(true);
    validateToken().finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("expenseTrackerToken", data.token);
      setUser({ id: data.user?.id, email: data.user?.email || email });
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("expenseTrackerToken");
    setUser(null);
    setError(null);
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      setError("Session expired. Please log in again.");
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
