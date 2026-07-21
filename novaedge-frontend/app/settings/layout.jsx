"use client";

import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Shield, Smartphone, User } from "lucide-react";

const sidebarNavItems = [
    {
        title: "Profile",
        href: "/settings/profile",
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
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-6">
                <div className="space-y-6">
                    <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage your account settings and preferences.
                        </p>
                    </div>
                    <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
                        <aside className="lg:w-1/4">
                            <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                                {sidebarNavItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            buttonVariants({ variant: "ghost" }),
                                            pathname === item.href
                                                ? "bg-secondary text-foreground font-semibold"
                                                : "hover:bg-secondary/50 text-muted-foreground",
                                            "justify-start rounded-xl text-sm"
                                        )}
                                    >
                                        {item.icon}
                                        {item.title}
                                    </Link>
                                ))}
                            </nav>
                        </aside>
                        <div className="flex-1">{children}</div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
