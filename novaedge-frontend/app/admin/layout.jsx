// app/admin/layout.jsx
"use client";

import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  BarChart3,
  Shield,
  Award,
  HeadphonesIcon,
  FileText,
  MessageSquare,
  Briefcase,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ScrollText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import AdminGuard from "@/components/admin/AdminGuard";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
  { label: "Certificates", href: "/admin/certificates", icon: ScrollText },
  { label: "Badges", href: "/admin/badges", icon: Award },
  { label: "Support", href: "/admin/support", icon: HeadphonesIcon },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Careers", href: "/admin/careers", icon: Briefcase },
  { label: "Mentors", href: "/admin/mentors", icon: UserCheck },
  { label: "Audit Logs", href: "/admin/audit", icon: Shield },
];

const premiumSpring = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.8,
};

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-background">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: collapsed ? 72 : 260 }}
          transition={premiumSpring}
          className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-border/50 glass-panel overflow-hidden"
        >
          {/* Logo Area */}
          <div className="flex items-center justify-between px-4 h-16 shrink-0">
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-heading text-sm font-bold tracking-tight text-foreground">
                    NovaEdge Admin
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          <Separator className="opacity-50" />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="admin-active-nav"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/90 to-primary/70"
                        transition={premiumSpring}
                        style={{ zIndex: -1 }}
                      />
                    )}
                    <Icon className="h-4 w-4 shrink-0" />
                    <AnimatePresence mode="wait">
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className="truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <Separator className="opacity-50" />

          {/* User Footer */}
          <div className="p-3 shrink-0">
            <div
              className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
            >
              <Avatar className="h-9 w-9 shrink-0 border border-primary/30">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium truncate">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email || "admin@novaedge.in"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "default"}
              onClick={logout}
              className={`mt-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 ${collapsed ? "w-full justify-center" : "w-full"}`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <motion.main
          animate={{ marginLeft: collapsed ? 72 : 260 }}
          transition={premiumSpring}
          className="flex-1 min-h-screen"
        >
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </motion.main>
      </div>
    </AdminGuard>
  );
}
