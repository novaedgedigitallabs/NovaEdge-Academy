"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        router.push("/login");
    };

    return (
        <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-white tracking-tighter">
                    Nova<span className="text-blue-500">Edge</span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/courses" className="text-gray-400 hover:text-white transition-colors">
                        Courses
                    </Link>
                    {isAuthenticated && (
                        <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <Button variant="ghost" onClick={handleLogout} className="text-gray-400 hover:text-white">
                            Logout
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login">
                                <Button variant="ghost" className="text-gray-400 hover:text-white">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
