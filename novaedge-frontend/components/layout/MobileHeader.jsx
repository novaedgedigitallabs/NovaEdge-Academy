"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { apiGet } from "@/lib/api";
import { getFriendRequests } from "@/services/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  X,
  Search,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  Users,
  UserPlus,
  Globe,
  Newspaper,
  MessageSquare,
  User,
  Settings,
  LogOut,
  PenSquare,
  Loader2,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreatePost from "@/components/post/CreatePost";

const mobileDrawerLinks = [
  { icon: LayoutDashboard, route: "/", label: "Dashboard" },
  { icon: BookOpen, route: "/courses", label: "Explore Courses" },
  { icon: GraduationCap, route: "/enrollments", label: "My Learning" },
  { icon: Award, route: "/certificates", label: "Certificates" },
  { icon: Users, route: "/mentors", label: "Mentors" },
  { icon: UserPlus, route: "/network", label: "My Network", badgeKey: "requests" },
  { icon: Globe, route: "/community", label: "Community Stage" },
  { icon: Newspaper, route: "/blog", label: "Blog & Articles" },
  { icon: MessageSquare, route: "/messages", label: "Messages", badgeKey: "requests" },
  { icon: User, route: "/profile", label: "My Profile" },
  { icon: Settings, route: "/settings", label: "Settings" },
];

export default function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // Close drawer on pathname change
  useEffect(() => {
    setIsDrawerOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Fetch pending friend requests
  useEffect(() => {
    if (user) {
      getFriendRequests()
        .then((res) => {
          if (res.success && Array.isArray(res.requests)) {
            setPendingRequestsCount(res.requests.length);
          }
        })
        .catch(() => {});
    }
  }, [user, pathname]);

  // Mobile live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await apiGet(`/api/v1/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.success && Array.isArray(res.results)) {
          setSearchResults(res.results);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Search error", err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
      {/* Mobile Sticky Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md px-4 py-2.5 flex items-center justify-between md:hidden shadow-xs">
        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDrawerOpen(true)}
            className="h-9 w-9 rounded-full text-foreground hover:bg-secondary/60 cursor-pointer"
            aria-label="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center">
            <Image
              src="/logo1.png"
              alt="NovaEdge Academy"
              width={140}
              height={32}
              className="h-7 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search Trigger */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(true)}
            className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/60 cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-4.5 w-4.5" />
          </Button>

          {/* User Profile Avatar */}
          {user ? (
            <Link href="/profile">
              <Avatar className="h-8 w-8 border border-primary/30 shrink-0">
                <AvatarImage src={user.avatar?.url} alt={user.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user.name?.[0]}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/login">
              <Button size="sm" className="h-8 rounded-full text-xs font-bold px-3">
                Login
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Slide-over Mobile Drawer Menu */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <div className="relative w-80 max-w-[82vw] bg-[#0b0e17] border-r border-border/80 h-full flex flex-col justify-between p-5 z-10 shadow-2xl animate-in slide-in-from-left duration-250 custom-scrollbar overflow-y-auto">
            <div className="space-y-6">
              {/* Header & Close */}
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <Link href="/" onClick={() => setIsDrawerOpen(false)}>
                  <Image
                    src="/logo1.png"
                    alt="NovaEdge Academy"
                    width={150}
                    height={36}
                    className="h-8 w-auto object-contain"
                    unoptimized
                  />
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDrawerOpen(false)}
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground bg-secondary/50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* User Banner Card if logged in */}
              {user && (
                <div className="p-3 rounded-2xl bg-secondary/30 border border-border/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border border-primary/30 shrink-0">
                      <AvatarImage src={user.avatar?.url} alt={user.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {user.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username || user.email?.split("@")[0]}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1">
                {mobileDrawerLinks.map((link) => {
                  const isActive =
                    link.route === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.route);
                  const Icon = link.icon;
                  const hasBadge =
                    link.badgeKey === "requests" && pendingRequestsCount > 0;

                  return (
                    <Link
                      key={link.label}
                      href={link.route}
                      onClick={() => setIsDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/15 text-primary font-bold"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("h-4.5 w-4.5", isActive ? "text-primary stroke-[2.5]" : "stroke-[1.75]")} />
                        <span>{link.label}</span>
                      </div>
                      {hasBadge && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {pendingRequestsCount}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Create Post Action */}
              <Button
                onClick={() => {
                  setIsDrawerOpen(false);
                  setIsPostOpen(true);
                }}
                className="w-full rounded-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-2 text-sm shadow-md"
              >
                <PenSquare className="h-4 w-4" />
                <span>Create Post</span>
              </Button>
            </div>

            {/* Bottom Footer Actions */}
            {user && (
              <div className="border-t border-border/50 pt-4 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    logout();
                  }}
                  className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 rounded-xl text-sm font-semibold"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>Logout Account</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Global Search Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-lg p-4 bg-[#0b0e17] border border-border rounded-2xl shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Search className="w-4 h-4 text-primary" /> Global Search
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSearchOpen(false)}
                className="h-6 text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search users, courses, mentors, blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="pl-9 text-xs bg-secondary/30 border-border h-10 rounded-xl"
              />
            </div>

            {/* Results Container */}
            <div className="max-h-64 overflow-y-auto divide-y divide-border/40 custom-scrollbar">
              {searching ? (
                <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" /> Searching...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery("");
                      if (item.type === "user") router.push(`/${item.username || item._id}`);
                      else if (item.type === "course") router.push(`/courses/${item.slug || item._id}`);
                      else if (item.type === "mentor") router.push(`/mentors`);
                      else if (item.type === "blog") router.push(`/blog/${item.slug || item._id}`);
                    }}
                    className="p-3 hover:bg-primary/10 transition-colors cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                        {item.type?.[0] || "S"}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{item.name || item.title}</p>
                        <p className="text-[10px] text-muted-foreground capitalize">{item.type} · {item.subtitle || "NovaEdge"}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : searchQuery.trim() ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No matching results found.
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Type to search across NovaEdge Academy...
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Mobile Create Post Modal */}
      <Dialog open={isPostOpen} onOpenChange={setIsPostOpen}>
        <DialogContent className="sm:max-w-lg p-0 bg-background border border-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-border/60 flex items-center justify-between">
            <span className="text-sm font-bold flex items-center gap-2">
              <PenSquare className="w-4 h-4 text-primary" /> Create a Post
            </span>
          </div>
          <div className="p-2">
            <CreatePost onPostCreated={() => setIsPostOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
