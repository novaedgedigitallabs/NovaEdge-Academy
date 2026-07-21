"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Bell, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
    {
        icon: Home,
        route: "/",
        label: "Home",
    },
    {
        icon: Search,
        route: "/courses",
        label: "Explore",
    },
    {
        icon: Bell,
        route: "/notifications",
        label: "Notifications",
    },
    {
        icon: Mail,
        route: "/messages",
        label: "Messages",
    },
];

export default function MobileNav() {
    const pathname = usePathname();

    return (
        <section className="fixed bottom-0 z-50 w-full border-t border-border bg-background/80 backdrop-blur-md md:hidden">
            <div className="flex items-center justify-between px-6 py-3">
                {navLinks.map((link) => {
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 transition-colors",
                                isActive && "text-primary"
                            )}
                        >
                            <link.icon className={cn("h-6 w-6", isActive ? "fill-current" : "")} />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
