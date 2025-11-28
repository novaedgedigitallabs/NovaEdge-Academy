"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Shield, Smartphone, User } from "lucide-react";

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/profile", // Keeping original profile page for now
        icon: <User className="w-4 h-4 mr-2" />,
    },
    {
        title: "Security",
        href: "/settings/security",
        icon: <Shield className="w-4 h-4 mr-2" />,
    },
    {
        title: "Sessions",
        href: "/settings/sessions",
        icon: <Smartphone className="w-4 h-4 mr-2" />,
    },
];

export default function SettingsLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="space-y-6">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences.
                    </p>
                </div>
                <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                        <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                            {sidebarNavItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        pathname === item.href
                                            ? "bg-muted hover:bg-muted"
                                            : "hover:bg-transparent hover:underline",
                                        "justify-start"
                                    )}
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            ))}
                        </nav>
                    </aside>
                    <div className="flex-1 lg:max-w-2xl">{children}</div>
                </div>
            </div>
        </div>
    );
}
