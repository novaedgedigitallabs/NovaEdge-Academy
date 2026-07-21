"use client";

import { Search, Trophy, TrendingUp, Clock, X, Check, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { toast } from "sonner";

const DEFAULT_SCHEDULE = [
    { id: "1", title: "Advanced React Workshop", date: "Dec 30", time: "10:00 AM", type: "Live Class", href: "/courses" },
    { id: "2", title: "UI/UX Design Review", date: "Jan 02", time: "02:30 PM", type: "Mentorship", href: "/courses" },
    { id: "3", title: "Career Growth Seminar", date: "Jan 05", time: "04:00 PM", type: "Webinar", href: "/courses" }
];

const DEFAULT_LEADERBOARD = [
    { id: "1", name: "Alex Johnson", points: "2,450", rank: 1, avatar: "AJ" },
    { id: "2", name: "Sarah Chen", points: "2,120", rank: 2, avatar: "SC" },
    { id: "3", name: "Michael Ross", points: "1,980", rank: 3, avatar: "MR" }
];

const DEFAULT_MENTORS = [
    { id: "m1", name: "Sarah Drasner", role: "Frontend Expert", avatar: "SD" },
    { id: "m2", name: "Guillermo Rauch", role: "Next.js Creator", avatar: "GR" }
];

const DEFAULT_HASHTAGS = [
    { tag: "#NextJS15", posts: "12.4K posts", category: "Technology" },
    { tag: "#WebDesign", posts: "8.2K posts", category: "Design" },
    { tag: "#NovaEdge", posts: "5.1K posts", category: "Education" }
];

export default function RightSidebar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    
    // Dynamic states
    const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
    const [leaderboard, setLeaderboard] = useState(DEFAULT_LEADERBOARD);
    const [mentors, setMentors] = useState(DEFAULT_MENTORS);
    const [hashtags, setHashtags] = useState(DEFAULT_HASHTAGS);
    const [following, setFollowing] = useState({});
    const [loadingMentors, setLoadingMentors] = useState({});

    // Fetch dynamic backend data on mount
    useEffect(() => {
        // Fetch Live Classes / Schedule
        apiGet("/api/v1/user/live/calendar")
            .then((res) => {
                if (res?.classes && Array.isArray(res.classes) && res.classes.length > 0) {
                    const formatted = res.classes.slice(0, 3).map((item) => {
                        const d = new Date(item.startTime || Date.now());
                        return {
                            id: item._id,
                            title: item.title || "Live Class",
                            date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
                            time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
                            type: item.type || "Live Class",
                            href: `/courses`
                        };
                    });
                    setSchedule(formatted);
                }
            })
            .catch(() => {});

        // Fetch Trending Hashtags
        apiGet("/api/v1/hashtag/trending")
            .then((res) => {
                if (res?.hashtags && Array.isArray(res.hashtags) && res.hashtags.length > 0) {
                    const formatted = res.hashtags.slice(0, 3).map((h) => ({
                        tag: `#${h.tag.replace(/^#/, "")}`,
                        posts: `${h.count || 1} posts`,
                        category: h.category || "Trending"
                    }));
                    setHashtags(formatted);
                }
            })
            .catch(() => {});
    }, []);

    const executeSearch = () => {
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            executeSearch();
        }
    };

    const toggleFollowMentor = (mentorId, mentorName) => {
        setLoadingMentors((prev) => ({ ...prev, [mentorId]: true }));
        
        setTimeout(() => {
            setFollowing((prev) => {
                const isCurrentlyFollowing = !!prev[mentorId];
                const newState = !isCurrentlyFollowing;
                toast.success(newState ? `Now following ${mentorName}` : `Unfollowed ${mentorName}`);
                return { ...prev, [mentorId]: newState };
            });
            setLoadingMentors((prev) => ({ ...prev, [mentorId]: false }));
        }, 300);
    };

    return (
        <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l border-border bg-background px-6 py-6 max-xl:hidden">
            {/* 1. Search Bar */}
            <div className="relative">
                <Search 
                    className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={executeSearch}
                />
                <Input
                    placeholder="Search NovaEdge"
                    className="rounded-full bg-secondary/50 border border-border/50 pl-11 pr-9 h-11 text-sm focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {query && (
                    <button
                        onClick={() => setQuery("")}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* 2. Upcoming Schedule Widget */}
            <div className="flex flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
                <div onClick={() => router.push("/courses")} className="px-4 pt-4 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">Upcoming Schedule</h3>
                </div>

                <div className="flex flex-col">
                    {schedule.map((event, i) => (
                        <div 
                            key={event.id || i} 
                            onClick={() => router.push(event.href || "/courses")}
                            className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors border-t border-border/40 cursor-pointer"
                        >
                            <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary flex-shrink-0 border border-primary/20">
                                <span className="text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</span>
                                <span className="text-sm font-black leading-none">{event.date.split(' ')[1] || ""}</span>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground line-clamp-1">{event.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        {event.time}
                                    </div>
                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                    <span>{event.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/courses" className="p-3.5 text-xs font-semibold text-primary hover:bg-secondary/30 transition-colors border-t border-border/40 text-center">
                    View full schedule
                </Link>
            </div>

            {/* 3. Leaderboard Widget */}
            <div className="flex flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
                <div onClick={() => router.push("/community")} className="px-4 pt-4 mb-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">Leaderboard</h3>
                    <Trophy className="h-4 w-4 text-amber-400" />
                </div>

                <div className="flex flex-col">
                    {leaderboard.map((student, i) => (
                        <div 
                            key={student.id || i} 
                            onClick={() => {
                                if (student.id && typeof student.id === "string" && student.id.length > 5) {
                                    router.push(`/user/${student.id}`);
                                } else {
                                    router.push("/community");
                                }
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors border-t border-border/40 cursor-pointer"
                        >
                            <div className="relative">
                                <div className="h-9 w-9 rounded-full bg-secondary/80 flex items-center justify-center text-xs font-bold text-foreground border border-border/60">
                                    {student.avatar || student.name?.substring(0, 2).toUpperCase()}
                                </div>
                                <div className={cn(
                                    "absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[9px] font-bold border border-background",
                                    student.rank === 1 ? "bg-amber-500 text-black" :
                                        student.rank === 2 ? "bg-slate-400 text-black" : "bg-amber-700 text-white"
                                )}>
                                    {student.rank}
                                </div>
                            </div>
                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-semibold text-foreground">{student.name}</p>
                                <p className="text-xs text-muted-foreground">{student.points} XP</p>
                            </div>
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                    ))}
                </div>
                <Link href="/community" className="p-3.5 text-xs font-semibold text-primary hover:bg-secondary/30 transition-colors border-t border-border/40 text-center">
                    View all rankings
                </Link>
            </div>

            {/* 4. Recommended Mentors */}
            <div className="flex flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
                <div onClick={() => router.push("/mentors")} className="px-4 pt-4 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">Recommended Mentors</h3>
                </div>

                <div className="flex flex-col">
                    {mentors.map((mentor, i) => {
                        const isFollowing = !!following[mentor.id];
                        const isLoading = !!loadingMentors[mentor.id];
                        return (
                            <div 
                                key={mentor.id || i} 
                                onClick={() => router.push(mentor.id && typeof mentor.id === "string" && mentor.id.length > 5 ? `/user/${mentor.id}` : "/mentors")}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors border-t border-border/40 cursor-pointer"
                            >
                                <div className="h-9 w-9 rounded-full bg-secondary/80 flex items-center justify-center text-xs font-bold text-foreground border border-border/60 flex-shrink-0">
                                    {mentor.avatar || mentor.name?.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground line-clamp-1">{mentor.name}</p>
                                    <p className="text-xs text-muted-foreground line-clamp-1">{mentor.role}</p>
                                </div>
                                <Button 
                                    size="sm" 
                                    variant={isFollowing ? "secondary" : "outline"} 
                                    disabled={isLoading}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFollowMentor(mentor.id, mentor.name);
                                    }}
                                    className={cn(
                                        "rounded-full h-7 text-xs font-semibold px-3 transition-all flex items-center gap-1.5",
                                        isFollowing 
                                            ? "bg-primary/20 text-primary border-primary/30 hover:bg-destructive/20 hover:text-destructive hover:border-destructive/40" 
                                            : "border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                    )}
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                    ) : isFollowing ? (
                                        <>
                                            <Check className="h-3 w-3" />
                                            Following
                                        </>
                                    ) : (
                                        "Follow"
                                    )}
                                </Button>
                            </div>
                        );
                    })}
                </div>
                <Link href="/mentors" className="p-3.5 text-xs font-semibold text-primary hover:bg-secondary/30 transition-colors border-t border-border/40 text-center">
                    Show more
                </Link>
            </div>

            {/* 5. Trending in Community */}
            <div className="flex flex-col rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md overflow-hidden">
                <div onClick={() => router.push("/community")} className="px-4 pt-4 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">What&apos;s happening</h3>
                </div>

                <div className="flex flex-col">
                    {hashtags.map((item, i) => {
                        const cleanTag = item.tag.replace(/^#/, "");
                        return (
                            <div 
                                key={i} 
                                onClick={() => router.push(`/hashtag/${encodeURIComponent(cleanTag)}`)}
                                className="px-4 py-3 hover:bg-secondary/40 cursor-pointer transition-colors border-t border-border/40"
                            >
                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">{item.category} · Trending</p>
                                <p className="font-bold text-sm text-foreground mt-0.5">{item.tag}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.posts}</p>
                            </div>
                        );
                    })}
                </div>
                <Link href="/community" className="p-3.5 text-xs font-semibold text-primary hover:bg-secondary/30 transition-colors border-t border-border/40 text-center">
                    Show more
                </Link>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 px-4 text-xs text-muted-foreground">
                <Link href="/terms" className="hover:underline">Terms of Service</Link>
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                <Link href="/cookies" className="hover:underline">Cookie Policy</Link>
                <Link href="/accessibility" className="hover:underline">Accessibility</Link>
                <Link href="/ads" className="hover:underline">Ads info</Link>
                <span>© 2025 NovaEdge Academy</span>
            </div>
        </section>
    );
}
