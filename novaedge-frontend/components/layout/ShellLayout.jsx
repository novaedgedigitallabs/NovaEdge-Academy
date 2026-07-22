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
        <div className="flex min-h-screen justify-center bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            {/* Left Sidebar - Persistent across SPA route transitions */}
            <LeftSidebar />

            {/* Main Middle Content Column */}
            <main className="flex w-full min-w-0 flex-col border-x border-border pb-20 sm:pb-10 max-w-2xl xl:max-w-3xl">
                {children}
            </main>

            {/* Right Sidebar - Persistent across SPA route transitions */}
            <RightSidebar />

            {/* Mobile Bottom Navigation */}
            <MobileNav />
        </div>
    );
}
