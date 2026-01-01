"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Map, Users, Network, Mail, User, Settings, MoreHorizontal, PenSquare, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarLinks = [
    {
        icon: Home,
        route: "/",
        label: "Dashboard",
    },
    {
        icon: BookOpen,
        route: "/courses",
        label: "Courses",
    },
    {
        icon: Map,
        route: "/enrollments",
        label: "My Learning",
    },
    {
        icon: User, // Using User for Certificates for now, or find a better icon
        route: "/certificate",
        label: "Certificates",
    },
    {
        icon: Users,
        route: "/mentors",
        label: "Mentors",
    },
    {
        icon: Network,
        route: "/community",
        label: "Community",
    },
    {
        icon: Mail,
        route: "/messages",
        label: "Messages",
    },
    {
        icon: User,
        route: "/profile",
        label: "Profile",
    },
    {
        icon: Settings,
        route: "/settings",
        label: "Settings",
    },
];

export default function LeftSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    return (
        <section className="custom-scrollbar sticky left-0 top-0 z-20 flex h-screen w-fit flex-col justify-between overflow-y-auto border-r border-border bg-background pb-6 pt-8 max-md:hidden lg:w-[266px]">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                <Link href="/" className="flex items-center gap-4 px-4">
                    {/* <div className="text-2xl font-bold">NovaEdge</div> */}
                    <span className="text-2xl font-bold tracking-tight">NovaEdge</span>
                </Link>

                <div className="flex flex-col gap-2">
                    {sidebarLinks.map((link) => {
                        const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

                        return (
                            <Link
                                href={link.route}
                                key={link.label}
                                className={cn(
                                    "flex items-center justify-start gap-4 rounded-full p-4 transition-colors hover:bg-secondary/50",
                                    isActive && "font-bold"
                                )}
                            >
                                <link.icon className={cn("h-7 w-7", isActive ? "fill-current" : "")} />
                                <p className="text-xl max-lg:hidden">{link.label}</p>
                            </Link>
                        );
                    })}
                </div>

                <Button className="mt-4 w-full rounded-full text-lg font-bold h-12 lg:h-14">
                    <span className="max-lg:hidden">Post</span>
                    <PenSquare className="lg:hidden h-6 w-6" />
                </Button>
            </div>

            {user && (
                <div className="mt-10 px-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex cursor-pointer items-center justify-between gap-4 rounded-full p-3 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={user.avatar?.url} alt={user.name} />
                                        <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col max-lg:hidden">
                                        <p className="text-sm font-bold line-clamp-1">{user.name}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-1">@{user.username || user.email.split('@')[0]}</p>
                                    </div>
                                </div>
                                <MoreHorizontal className="h-5 w-5 max-lg:hidden" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out @{user.username || user.email.split('@')[0]}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </section>
    );
}
