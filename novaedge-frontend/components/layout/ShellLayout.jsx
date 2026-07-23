"use client";

import { usePathname } from "next/navigation";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileNav from "@/components/layout/MobileNav";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export default function ShellLayout({ children }) {
    const pathname = usePathname();
    const { isLoading } = useAuth();

    // Standalone routes that manage their own full page layouts (e.g. Auth, Admin, Mentor portals)
    const isStandalonePage = 
        pathname === "/login" || 
        pathname === "/register" || 
        pathname === "/forgot-password" ||
        pathname?.startsWith("/reset-password") ||
        pathname?.startsWith("/admin") ||
        pathname?.startsWith("/mentor/");

    if (isStandalonePage) {
        return <>{children}</>;
    }

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen w-full justify-between bg-transparent text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* Main Middle Content Column */}
            <main className="flex-1 w-full min-w-0 flex flex-col pb-20 sm:pb-10 border-r border-border/40">
                {children}
            </main>

            {/* Right Sidebar */}
            <RightSidebar />

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
