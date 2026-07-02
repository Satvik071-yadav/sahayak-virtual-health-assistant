import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../services/api";
import type { AuthToken, UserOut } from "../types";

interface AuthContextValue {
  user: UserOut | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    full_name: string;
    email: string;
    phone?: string;
    password: string;
    preferred_language: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vha_user");
    const token = localStorage.getItem("vha_token");
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  function persist(data: AuthToken) {
    localStorage.setItem("vha_token", data.access_token);
    localStorage.setItem("vha_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  async function login(email: string, password: string) {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);
    const { data } = await api.post<AuthToken>("/api/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    persist(data);
  }

  async function register(payload: {
    full_name: string;
    email: string;
    phone?: string;
    password: string;
    preferred_language: string;
  }) {
    const { data } = await api.post<AuthToken>("/api/auth/register", payload);
    persist(data);
  }

  function logout() {
    localStorage.removeItem("vha_token");
    localStorage.removeItem("vha_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
