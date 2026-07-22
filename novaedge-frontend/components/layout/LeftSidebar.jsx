"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    BookOpen, 
    GraduationCap, 
    Award, 
    Users, 
    Globe, 
    MessageSquare, 
    User, 
    Settings, 
    MoreHorizontal, 
    PenSquare, 
    LogOut 
} from "lucide-react";
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
        icon: LayoutDashboard,
        route: "/",
        label: "Dashboard",
    },
    {
        icon: BookOpen,
        route: "/courses",
        label: "Courses",
    },
    {
        icon: GraduationCap,
        route: "/enrollments",
        label: "My Learning",
    },
    {
        icon: Award,
        route: "/certificates",
        label: "Certificates",
    },
    {
        icon: Users,
        route: "/mentors",
        label: "Mentors",
    },
    {
        icon: Globe,
        route: "/community",
        label: "Community",
    },
    {
        icon: MessageSquare,
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
                <Link href="/" className="flex items-center gap-3 px-3">
                    <Image
                        src="/Header_logo.webp"
                        alt="NovaEdge Logo"
                        width={36}
                        height={36}
                        className="h-9 w-9 object-contain shrink-0"
                    />
                    <span className="text-2xl font-black tracking-tight text-foreground max-lg:hidden">NovaEdge</span>
                </Link>

                <div className="flex flex-col gap-1.5">
                    {sidebarLinks.map((link) => {
                        const isActive = link.route === "/" 
                            ? pathname === "/" 
                            : pathname.startsWith(link.route);

                        const IconComponent = link.icon;

                        return (
                            <Link
                                href={link.route}
                                key={link.label}
                                className={cn(
                                    "flex items-center justify-start gap-4 rounded-full px-4 py-3 transition-all font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground group",
                                    isActive && "bg-primary/15 text-primary font-bold hover:bg-primary/20 hover:text-primary shadow-xs"
                                )}
                            >
                                <IconComponent 
                                    className={cn(
                                        "h-6 w-6 shrink-0 transition-transform group-hover:scale-105", 
                                        isActive ? "text-primary stroke-[2.5]" : "stroke-[1.75]"
                                    )} 
                                />
                                <p className="text-base max-lg:hidden">{link.label}</p>
                            </Link>
                        );
                    })}

                    {user && (
                        <button
                            onClick={logout}
                            className="flex items-center justify-start gap-4 rounded-full px-4 py-3 transition-all font-medium text-destructive hover:bg-destructive/10 hover:text-destructive group w-full text-left cursor-pointer"
                        >
                            <LogOut className="h-6 w-6 shrink-0 stroke-[1.75] transition-transform group-hover:scale-105" />
                            <p className="text-base max-lg:hidden">Logout</p>
                        </button>
                    )}
                </div>

                <Button className="mt-2 w-full rounded-full text-base font-bold h-12 lg:h-13 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">
                    <span className="max-lg:hidden">Post</span>
                    <PenSquare className="lg:hidden h-5 w-5" />
                </Button>
            </div>

            {user && (
                <div className="mt-6 px-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex cursor-pointer items-center justify-between gap-3 rounded-full p-2.5 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar className="h-9 w-9 border border-primary/20 flex-shrink-0 overflow-hidden">
                                        <AvatarImage src={user.avatar?.url} alt={user.name} className="object-cover object-center w-full h-full" />
                                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                                            {user.name?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col max-lg:hidden min-w-0">
                                        <p className="text-sm font-bold line-clamp-1 text-foreground leading-tight">{user.name}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">@{user.username || user.email?.split('@')[0]}</p>
                                    </div>
                                </div>
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground max-lg:hidden flex-shrink-0" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out @{user.username || user.email?.split('@')[0]}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </section>
    );
}
