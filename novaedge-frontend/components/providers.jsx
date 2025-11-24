"use client";

import { AuthProvider } from "@/context/auth-context";

export function Providers({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
