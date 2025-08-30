"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  identifier: string; // CRECI for admin, email for regular user
  role: "admin" | "user";
  name?: string;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
        const userData = localStorage.getItem("user");
        
        if (isLoggedIn && userData) {
          try {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setIsAuthenticated(true);
          } catch {
            // Invalid user data, clear storage
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("user");
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData: User) => {
    console.log("useAuth login called with:", userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("localStorage updated");
    }
    setUser(userData);
    setIsAuthenticated(true);
    console.log("State updated in useAuth");
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
    }
    setUser(null);
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    isAdmin: user?.role === "admin",
    isUser: user?.role === "user"
  };
}