// context/auth-context.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // LOAD USER ON PAGE LOAD (GET /api/v1/me)
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const data = await apiGet("/api/v1/me");
        if (isMounted) {
          if (data && data.success !== false && data.user) {
            console.log("User authenticated:", data.user?.email);
            setUser(data.user);
          } else {
            console.log("Auth check returned false:", data?.message);
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
            }
            setUser(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.log("Auth check failed:", err.response?.status || err.message);
          // Only clear user on 401 Unauthorized
          if (err.response?.status === 401) {
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
            }
            setUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // LOGIN (POST /api/v1/login) - returns { ok, message }
  const login = async (email, password) => {
    if (!email || !password) {
      setIsLoading(false);
      return { ok: false, message: "Please enter email and password" };
    }

    setIsLoading(true);
    try {
      const data = await apiPost("/api/v1/login", { email, password }, { validateStatus: status => status < 500 });
      
      if (data.success === false) {
        setIsLoading(false);
        return { ok: false, message: data.message || "Login failed" };
      }

      // 2FA Check
      if (data.require2fa) {
        setIsLoading(false);
        return { ok: true, require2fa: true, tempToken: data.tempToken };
      }

      // success
      const loggedUser = data.user || data;
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }
      setUser(loggedUser);
      setIsLoading(false);

      if ((loggedUser?.role || data?.role) === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/courses");
      }

      return { ok: true };
    } catch (err) {
      setIsLoading(false);
      const message = err.response?.data?.message || err.message || "Network error";
      return { ok: false, message };
    }
  };

  // REGISTER (POST /api/v1/register)
  const register = async (email, name, password, referralCode, username, phoneNumber) => {
    setIsLoading(true);

    try {
      const data = await apiPost("/api/v1/register", {
        name,
        email,
        password,
        referralCode,
        username,
        phoneNumber,
      });

      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
      }

      setUser(data.user || data);
      setIsLoading(false);
      router.push("/courses");
      return { ok: true };
    } catch (err) {
      console.error("Register error:", err);
      setIsLoading(false);
      const message = err.response?.data?.message || err.message || "Registration failed";
      return { ok: false, message };
    }
  };

  // LOGOUT (GET /api/v1/logout)
  const logout = async () => {
    try {
      await apiGet("/api/v1/logout");
    } catch (e) {
      console.warn("Logout request failed", e);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

