"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { setSession, clearSession, getToken, getStoredUser, dashboardPathForRole } from "@/lib/auth";
import type { User } from "@/types";
import { toast } from "sonner";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refetchUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await api.get<User>("/auth/me");
      setUser(res.data);
    } catch {
      const cached = getStoredUser();
      setUser(cached);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (token: string, u: User) => {
    setSession(token, u);
    setUser(u);
  };

  const logout = () => {
    clearSession();
    setUser(null);
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function dashboardHomeFor(user: User | null) {
  if (!user) return "/login";
  return dashboardPathForRole(user.role);
}
