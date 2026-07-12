"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiClient, TOKEN_KEY } from "@/lib/api-client";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

/**
 * Public shape of the authenticated user, shared between client and server.
 */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: () => boolean;
  currentUser: () => AuthUser | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_KEY = "transitops.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /** Hydrate auth state from localStorage on first mount. */
  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const storedUser = window.localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        // Corrupt storage — wipe it.
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  /** Listen for session-expired events from the axios interceptor. */
  useEffect(() => {
    const handler = () => {
      setUser(null);
      setToken(null);
      toast.warn("Session expired. Please log in again.");
      router.push("/login");
    };
    window.addEventListener("transitops:session-expired", handler);
    return () =>
      window.removeEventListener("transitops:session-expired", handler);
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post<{
        success: boolean;
        token: string;
        user: AuthUser;
      }>("/auth/login", { email, password });

      window.localStorage.setItem(TOKEN_KEY, data.token);
      window.localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      return true;
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Login failed. Please try again.";
      toast.error(message);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
    setUser(null);
    setToken(null);
    toast.info("You have been logged out.");
    router.push("/login");
  }, [router]);

  const isAuthenticated = useCallback(() => Boolean(token && user), [token, user]);
  const currentUser = useCallback(() => user, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated,
      currentUser,
    }),
    [user, token, loading, login, logout, isAuthenticated, currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
