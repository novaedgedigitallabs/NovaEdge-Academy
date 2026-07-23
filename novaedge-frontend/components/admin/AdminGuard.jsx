// components/admin/AdminGuard.jsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { ShieldAlert, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ROLE_PERMISSIONS = {
  admin: [
    "/admin/dashboard",
    "/admin/analytics",
    "/admin/courses",
    "/admin/users",
    "/admin/enrollments",
    "/admin/certificates",
    "/admin/badges",
    "/admin/support",
    "/admin/testimonials",
    "/admin/blogs",
    "/admin/careers",
    "/admin/mentors",
    "/admin/audit",
  ],
  mentor: [
    "/admin/dashboard",
    "/admin/courses",
    "/admin/enrollments",
    "/admin/certificates",
    "/admin/testimonials",
    "/admin/blogs",
    "/admin/mentors",
  ],
  agent: [
    "/admin/dashboard",
    "/admin/support",
    "/admin/users",
    "/admin/enrollments",
    "/admin/certificates",
    "/admin/testimonials",
  ],
};

export const isAllowedRole = (role) => {
  return ["admin", "mentor", "agent"].includes(role);
};

export const hasRoutePermission = (role, pathname) => {
  if (role === "admin") return true;
  const allowedRoutes = ROLE_PERMISSIONS[role] || [];
  return allowedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
};

export default function AdminGuard({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (!isAllowedRole(user.role)) {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || !isAllowedRole(user.role)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check specific route permissions for allowed staff roles
  const permitted = hasRoutePermission(user.role, pathname);

  if (!permitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="glass-card max-w-md w-full p-8 text-center space-y-5 rounded-2xl border border-red-500/20 bg-card/60 backdrop-blur-md shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-bold font-heading text-foreground">
              Access Denied
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your current role (<span className="capitalize font-semibold text-foreground">{user.role}</span>) does not have permission to view <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] text-primary">{pathname}</code>.
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/dashboard")}
            className="w-full rounded-xl bg-primary text-primary-foreground font-semibold text-xs py-2.5 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
