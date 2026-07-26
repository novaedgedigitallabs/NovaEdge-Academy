"use client";

import { useState, useEffect } from "react";
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
    PenSquare,
    LogOut,
    Newspaper,
    UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { getFriendRequests } from "@/services/friend";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import CreatePost from "@/components/post/CreatePost";

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
        icon: UserPlus,
        route: "/network",
        label: "My Network",
        badgeKey: "requests",
    },
    {
        icon: Globe,
        route: "/community",
        label: "Community",
    },
    {
        icon: Newspaper,
        route: "/blog",
        label: "Blog",
    },
    {
        icon: MessageSquare,
        route: "/messages",
        label: "Messages",
        badgeKey: "requests",
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
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

    useEffect(() => {
        if (user) {
            getFriendRequests()
                .then((res) => {
                    if (res.success && Array.isArray(res.requests)) {
                        setPendingRequestsCount(res.requests.length);
                    }
                })
                .catch(() => { });
        }
    }, [user, pathname]);

    return (
        <section className="custom-scrollbar glass-sidebar sticky left-0 top-0 z-20 flex h-screen w-[240px] xl:w-[266px] shrink-0 flex-col justify-between overflow-y-auto border-r pb-6 pt-8 max-md:hidden">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                <Link href="/" className="flex items-center px-3 py-1">
                    <Image
                        src="/logo1.png"
                        alt="NovaEdge Academy"
                        width={180}
                        height={40}
                        className="h-auto w-auto object-contain"
                        priority
                        unoptimized
                    />
                </Link>

                <div className="flex flex-col gap-1.5">
                    {sidebarLinks.map((link) => {
                        const isActive = link.route === "/"
                            ? pathname === "/"
                            : pathname.startsWith(link.route);

                        const IconComponent = link.icon;
                        const hasBadge = link.badgeKey === "requests" && pendingRequestsCount > 0;

                        return (
                            <Link
                                href={link.route}
                                key={link.label}
                                className={cn(
                                    "flex items-center justify-between gap-3 rounded-full px-4 py-3 transition-all font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground group",
                                    isActive && "bg-primary/15 text-primary font-bold hover:bg-primary/20 hover:text-primary shadow-xs"
                                )}
                            >
                                <div className="flex items-center gap-3.5 min-w-0">
                                    <IconComponent
                                        className={cn(
                                            "h-5 w-5 shrink-0 transition-transform group-hover:scale-105",
                                            isActive ? "text-primary stroke-[2.5]" : "stroke-[1.75]"
                                        )}
                                    />
                                    <p className="text-sm font-semibold truncate">{link.label}</p>
                                </div>

                                {hasBadge && (
                                    <span className="bg-primary text-primary-foreground text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                                        {pendingRequestsCount}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    {user && (
                        <button
                            onClick={logout}
                            className="flex items-center justify-start gap-3.5 rounded-full px-4 py-3 transition-all font-medium text-destructive hover:bg-destructive/10 hover:text-destructive group w-full text-left cursor-pointer"
                        >
                            <LogOut className="h-5 w-5 shrink-0 stroke-[1.75] transition-transform group-hover:scale-105" />
                            <p className="text-sm font-semibold">Logout</p>
                        </button>
                    )}
                </div>

                <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
                    <Button
                        type="button"
                        onClick={() => setIsPostDialogOpen(true)}
                        className="mt-2 w-full rounded-full text-sm font-bold h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                        <PenSquare className="h-4 w-4" />
                        <span>Post</span>
                    </Button>
                    <DialogContent className="sm:max-w-xl p-0 border border-border bg-background rounded-2xl overflow-hidden shadow-2xl">
                        <DialogHeader className="px-6 pt-5 pb-3 border-b border-border/60">
                            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                                <PenSquare className="w-5 h-5 text-primary" /> Create a Post
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-2">
                            <CreatePost onPostCreated={() => setIsPostDialogOpen(false)} />
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {user && (
                <div className="mt-4 px-4 pt-3 border-t border-border/40">
                    <Link
                        href="/profile"
                        className="flex cursor-pointer items-center justify-between gap-2.5 rounded-full p-2 hover:bg-secondary/50 transition-colors border border-transparent hover:border-border/50 group"
                        title="View Profile"
                    >
                        <div className="flex items-center gap-2.5 min-w-0">
                            <Avatar className="h-9 w-9 border border-primary/20 flex-shrink-0 overflow-hidden group-hover:border-primary/50 transition-colors">
                                <AvatarImage src={user.avatar?.url} alt={user.name} className="object-cover object-center w-full h-full" />
                                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                                    {user.name?.[0] || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                                <p className="text-xs font-bold line-clamp-1 text-foreground leading-tight group-hover:text-primary transition-colors">{user.name}</p>
                                <p className="text-[11px] text-muted-foreground line-clamp-1">@{user.username || user.email?.split('@')[0]}</p>
                            </div>
                        </div>
                    </Link>
                </div>
            )}
        </section>
    );
}
