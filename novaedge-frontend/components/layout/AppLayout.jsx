"use client";

import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import MobileNav from "@/components/layout/MobileNav";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AppLayout({ children, showRightSidebar = true, hideMobileNav = false, className }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen justify-center bg-background text-foreground">
            <LeftSidebar />
            <main className={cn("flex w-full min-w-0 flex-col border-x border-border pb-20 sm:pb-10", showRightSidebar ? "max-w-2xl xl:max-w-3xl" : "max-w-5xl", className)}>
                {children}
            </main>
            {showRightSidebar && <RightSidebar />}
            {!hideMobileNav && <MobileNav />}
        </div>
    );
}
