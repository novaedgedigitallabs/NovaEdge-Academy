// context/auth-context.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // LOAD USER ON PAGE LOAD  (GET /api/v1/me)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/me`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.log("Auth check failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // LOGIN (POST /api/v1/login) - returns { ok, message }
  const login = async (email, password) => {
    // frontend validation
    if (!email || !password) {
      setIsLoading(false);
      return { ok: false, message: "Please enter email and password" };
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        // non-json response
      }

      console.log("LOGIN response status:", res.status, "body:", data);

      if (!res.ok) {
        const message = data?.message || `Login failed (status ${res.status})`;
        setIsLoading(false);
        return { ok: false, message };
      }

      // 2FA Check
      if (data.require2fa) {
        setIsLoading(false);
        return { ok: true, require2fa: true, tempToken: data.tempToken };
      }

      // success
      const loggedUser = data.user || data;
      setUser(loggedUser);
      setIsLoading(false);

      if ((loggedUser?.role || data?.role) === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/courses");
      }

      return { ok: true };
    } catch (err) {
      console.error("Login error:", err);
      setIsLoading(false);
      return { ok: false, message: err.message || "Network error" };
    }
  };

  // REGISTER (POST /api/v1/register)
  const register = async (email, name, password, referralCode, username, phoneNumber) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name, email, password, referralCode, username, phoneNumber }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        return { ok: false, message: data.message || "Registration failed" };
      }

      setUser(data.user || data);
      setIsLoading(false);
      router.push("/courses");
      return { ok: true };
    } catch (err) {
      console.error("Register error:", err);
      setIsLoading(false);
      return { ok: false, message: err.message || "Network error" };
    }
  };

  // LOGOUT (GET /api/v1/logout)
  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/logout`, {
        credentials: "include",
      });
    } catch (e) {
      console.warn("Logout request failed", e);
    } finally {
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
