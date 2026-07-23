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
        route: "/network",
        label: "Network",
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
        <section className="fixed bottom-0 z-50 w-full border-t border-border bg-background/90 backdrop-blur-md md:hidden">
            <div className="flex items-center justify-around px-4 py-2.5">
                {navLinks.map((link) => {
                    const isActive = link.route === "/" 
                        ? pathname === "/" 
                        : pathname.startsWith(link.route);

                    return (
                        <Link
                            href={link.route}
                            key={link.label}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 transition-colors rounded-full",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <link.icon className={cn("h-5 w-5 transition-transform", isActive ? "stroke-[2.5]" : "stroke-[1.75]")} />
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
