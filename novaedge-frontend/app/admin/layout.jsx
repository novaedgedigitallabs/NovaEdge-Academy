"use client";

import { useAuth } from "@/context/auth-context";
import Link from "next/link";

import { ModeToggle } from "@/components/ui/mode-toggle";

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r p-6 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold">Admin Panel</h2>
          <ModeToggle />
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <Link
            href="/admin/dashboard"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/courses"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            Courses
          </Link>
          <Link
            href="/admin/courses/new"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            New Course
          </Link>
          <Link
            href="/admin/users"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            Users
          </Link>
          <Link
            href="/admin/enrollments"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            Enrollments
          </Link>
          <Link
            href="/admin/careers"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            Careers
          </Link>
          <Link
            href="/admin/blogs"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            Blogs
          </Link>
          <Link
            href="/admin/mentors"
            className="px-3 py-2 rounded hover:bg-muted"
          >
            Mentors
          </Link>
        </nav>

        <div className="mt-6 pt-4 border-t">
          <div className="mb-3 text-sm text-muted-foreground">Logged in as</div>
          <div className="mb-4">
            <div className="text-sm font-medium">
              {user?.name || user?.email || "Admin"}
            </div>
            <div className="text-xs text-muted-foreground">
              {user?.role || "admin"}
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
