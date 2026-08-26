import React, { createContext, useState, useEffect, useCallback } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} from "../services/auth.api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Restore authenticated session from HTTP-only cookie on application mount
  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMe();
      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Register
  const register = async ({ username, email, password }) => {
    try {
      setLoading(true);
      setAuthError(null);
      const data = await registerUser({ username, email, password });
      if (data?.success && data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.message || "Registration failed" };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Registration failed";
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setAuthError(null);
      const data = await loginUser({ email, password });
      if (data?.success && data?.user) {
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.message || "Login failed" };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setAuthError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setUser(null);
      setAuthError(null);
      return { success: true };
    } catch (err) {
      console.error("[Logout Error]:", err);
      setUser(null);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    register,
    login,
    logout,
    clearError,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
