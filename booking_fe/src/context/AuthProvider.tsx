'use client';
import React, { createContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: any;
  setUser: React.Dispatch<any>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token: any = localStorage.getItem("authToken");
    const userData: any = localStorage.getItem("userData");

    if (token && userData) {
      setUser({ token, ...JSON.parse(userData) });
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("authToken", user.token);
      localStorage.setItem("userData", JSON.stringify(user));
    }
  }, [user]);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
