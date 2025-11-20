"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, Users, LogOut } from "lucide-react";
import { authService } from "@/services/api";

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await authService.getMe();
                if (user.role !== "admin") {
                    router.push("/"); // Redirect non-admins
                }
            } catch (error) {
                router.push("/login");
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [router]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Verifying Admin Access...</div>;

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/courses", label: "Courses", icon: BookOpen },
        { href: "/admin/users", label: "Users", icon: Users },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-white tracking-tighter">
                        Nova<span className="text-blue-500">Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start gap-3 ${isActive ? "bg-blue-600 text-white hover:bg-blue-700" : "text-gray-400 hover:text-white hover:bg-gray-800"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/login");
                        }}
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black p-8">
                {children}
            </main>
        </div>
    );
}
