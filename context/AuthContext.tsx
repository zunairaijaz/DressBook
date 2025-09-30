"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from sessionStorage on initial load
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("shopsphere_user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("Could not parse user from sessionStorage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return false;
      }

      setUser(data.user);
      sessionStorage.setItem("shopsphere_user", JSON.stringify(data.user));
      sessionStorage.setItem("shopsphere_token", data.token);
      setLoading(false);
      return true;
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
      return false;
    }
  };

  // SIGNUP
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Signup failed");
        setLoading(false);
        return false;
      }

      // Optionally log the user in immediately after signup
      setUser(data.user);
      sessionStorage.setItem("shopsphere_user", JSON.stringify(data.user));
      setLoading(false);
      return true;
    } catch (err) {
      setError("Something went wrong");
      setLoading(false);
      return false;
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("shopsphere_user");
    sessionStorage.removeItem("shopsphere_token");
    window.location.href = "/";
  };

  const authContextValue = {
    user,
    loading,
    error,
    login,
    logout,
    signup,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
