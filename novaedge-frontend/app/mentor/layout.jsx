"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    MessageSquare,
    FileText,
    Settings,
    LogOut
} from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function MentorLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        if (!loading && (!user || (user.role !== "mentor" && user.role !== "admin"))) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>;
    }

    if (!user || (user.role !== "mentor" && user.role !== "admin")) {
        return null;
    }

    const navItems = [
        { name: "Dashboard", href: "/mentor/dashboard", icon: LayoutDashboard },
        { name: "My Courses", href: "/mentor/courses", icon: BookOpen },
        { name: "Students", href: "/mentor/students", icon: Users },
        { name: "Questions", href: "/mentor/questions", icon: MessageSquare },
        // { name: "Assignments", href: "/mentor/assignments", icon: FileText }, // Could be per course or global
    ];

    return (
        <div className="flex h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 bg-zinc-950 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600"></div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                            NovaEdge
                        </span>
                    </Link>
                    <div className="mt-2 text-xs text-zinc-500 uppercase tracking-wider font-semibold">
                        Mentor Portal
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isActive
                                        ? "bg-blue-600/10 text-blue-400"
                                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                            {user.avatar?.url ? (
                                <img src={user.avatar.url} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-sm font-bold">{user.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user.name}</p>
                            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex w-full items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
