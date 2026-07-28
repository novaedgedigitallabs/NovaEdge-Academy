"use client";

import { usePathname } from "next/navigation";
import MobileHeader from "@/components/layout/MobileHeader";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileNav from "@/components/layout/MobileNav";
import AppLoadingSkeleton from "@/components/layout/AppLoadingSkeleton";
import { useAuth } from "@/context/auth-context";

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
        return <AppLoadingSkeleton />;
    }

    return (
        <div className="flex min-h-screen w-full flex-col md:flex-row justify-between bg-transparent text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Mobile Top Header */}
            <MobileHeader />

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
