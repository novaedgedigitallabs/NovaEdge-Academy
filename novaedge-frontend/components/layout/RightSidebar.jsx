"use client";

import { Search, Trophy, TrendingUp, Clock, X, Check, Loader2, Calendar, Users, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { apiGet } from "@/lib/api";
import { toast } from "sonner";

export default function RightSidebar() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    
    // Dynamic states initialized empty
    const [schedule, setSchedule] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [following, setFollowing] = useState({});
    const [loadingMentors, setLoadingMentors] = useState({});
    const [loadingData, setLoadingData] = useState(true);

    const loadAllData = async () => {
        setLoadingData(true);

        // 1. Load Bookings / Schedule
        const savedBookings = typeof window !== "undefined" 
            ? JSON.parse(localStorage.getItem("novaedge_my_bookings") || "[]") 
            : [];

        let backendBookings = [];
        try {
            const res = await apiGet("/api/v1/mentors/my-bookings");
            if (res?.success && Array.isArray(res.data)) {
                backendBookings = res.data.map(b => {
                    const d = new Date(b.date);
                    return {
                        id: b._id,
                        title: `1-on-1 Session with ${b.mentorName || "Mentor"}`,
                        date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
                        time: b.timeSlot,
                        type: "Mentorship",
                        href: "/mentors"
                    };
                });
            }
        } catch (e) {}

        const allUserBookings = [...savedBookings, ...backendBookings];
        const uniqueBookings = [];
        const seen = new Set();
        for (const item of allUserBookings) {
            const key = `${item.title}-${item.date}-${item.time}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueBookings.push(item);
            }
        }
        setSchedule(uniqueBookings);

        // 2. Load Real Mentors (with Images)
        try {
            const mentorRes = await apiGet("/api/v1/mentors");
            if (mentorRes?.success && Array.isArray(mentorRes.data)) {
                setMentors(mentorRes.data.map(m => ({
                    id: m._id || m.id,
                    name: m.name,
                    role: m.role || "Mentor",
                    image: m.image,
                    avatar: m.name ? m.name.substring(0, 2).toUpperCase() : "M",
                    company: m.company
                })));
            }
        } catch (e) {}

        // 3. Load Dynamic Hashtags
        try {
            const hashRes = await apiGet("/api/v1/hashtag/trending");
            if (hashRes?.hashtags && Array.isArray(hashRes.hashtags)) {
                const formatted = hashRes.hashtags.map((h) => ({
                    tag: `#${h.tag.replace(/^#/, "")}`,
                    posts: `${h.count || 1} posts`,
                    category: h.category || "Trending"
                }));
                setHashtags(formatted);
            }
        } catch (e) {}

        setLoadingData(false);
    };

    // Fetch dynamic backend data & listen to local booking updates
    useEffect(() => {
        loadAllData();

        const handleBookingUpdate = () => {
            loadAllData();
        };

        if (typeof window !== "undefined") {
            window.addEventListener("novaedge_booking_updated", handleBookingUpdate);
            window.addEventListener("storage", handleBookingUpdate);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("novaedge_booking_updated", handleBookingUpdate);
                window.removeEventListener("storage", handleBookingUpdate);
            }
        };
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
        <section className="custom-scrollbar glass-sidebar sticky right-0 top-0 z-20 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l px-6 py-6 max-xl:hidden">
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
            <div className="flex flex-col rounded-2xl glass-card border border-white/10 overflow-hidden">
                <div onClick={() => router.push("/community")} className="px-4 pt-4 mb-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">Upcoming Schedule</h3>
                    {schedule.length > 0 && (
                        <span className="text-[10px] font-extrabold bg-primary/20 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                            {schedule.length} {schedule.length === 1 ? "Event" : "Events"}
                        </span>
                    )}
                </div>

                {schedule.length > 0 ? (
                    <div className="flex flex-col max-h-64 overflow-y-auto custom-scrollbar">
                        {schedule.map((event, i) => (
                            <div 
                                key={event.id || i} 
                                onClick={() => router.push(event.href || "/community")}
                                className="flex items-start gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors border-t border-border/40 cursor-pointer"
                            >
                                <div className="flex flex-col items-center justify-center h-11 w-11 rounded-xl bg-primary/10 text-primary flex-shrink-0 border border-primary/20">
                                    <span className="text-[10px] font-bold uppercase">{event.date?.split(' ')?.[0] || "DEC"}</span>
                                    <span className="text-sm font-black leading-none">{event.date?.split(' ')?.[1]?.replace(',', '') || "11"}</span>
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-foreground line-clamp-1">{event.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3 text-muted-foreground" />
                                            {event.time}
                                        </div>
                                        <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                                        <span className="text-primary font-medium">{event.type}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-5 text-center flex flex-col items-center justify-center gap-2 border-t border-border/40">
                        <Calendar className="w-7 h-7 text-muted-foreground/40" />
                        <p className="text-xs font-semibold text-foreground">No upcoming sessions</p>
                        <p className="text-[11px] text-muted-foreground">Book a 1-on-1 session or register for workshops.</p>
                        <Button 
                            size="sm" 
                            onClick={() => router.push("/community")} 
                            className="mt-1 rounded-full h-7 text-xs px-3 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20"
                        >
                            Explore Events
                        </Button>
                    </div>
                )}
            </div>

            {/* 3. Leaderboard Widget */}
            <div className="flex flex-col rounded-2xl glass-card border border-white/10 overflow-hidden">
                <div onClick={() => router.push("/community")} className="px-4 pt-4 mb-3 flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">Leaderboard</h3>
                    <Trophy className="h-4 w-4 text-amber-400" />
                </div>

                {leaderboard.length > 0 ? (
                    <div className="flex flex-col max-h-56 overflow-y-auto custom-scrollbar">
                        {leaderboard.map((student, i) => (
                            <div 
                                key={student.id || i} 
                                onClick={() => router.push("/community")}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors border-t border-border/40 cursor-pointer"
                            >
                                <div className="relative">
                                    <div className="h-9 w-9 rounded-full bg-secondary/80 flex items-center justify-center text-xs font-bold text-foreground border border-border/60">
                                        {student.avatar || student.name?.substring(0, 2).toUpperCase()}
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
                ) : (
                    <div className="p-5 text-center flex flex-col items-center justify-center gap-1.5 border-t border-border/40">
                        <Trophy className="w-7 h-7 text-amber-400/40" />
                        <p className="text-xs font-semibold text-foreground">Leaderboard Rankings</p>
                        <p className="text-[11px] text-muted-foreground">Complete lectures to earn XP and rank up.</p>
                    </div>
                )}
            </div>

            {/* 4. Recommended Mentors */}
            <div className="flex flex-col rounded-2xl glass-card border border-white/10 overflow-hidden">
                <div onClick={() => router.push("/mentors")} className="px-4 pt-4 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">Recommended Mentors</h3>
                </div>

                {mentors.length > 0 ? (
                    <div className="flex flex-col max-h-56 overflow-y-auto custom-scrollbar">
                        {mentors.slice(0, 3).map((mentor, i) => {
                            const mId = mentor.id || i;
                            const isFollowing = !!following[mId];
                            const isLoading = !!loadingMentors[mId];
                            return (
                                <div 
                                    key={mId} 
                                    onClick={() => router.push("/mentors")}
                                    className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/40 transition-colors border-t border-border/40 cursor-pointer"
                                >
                                    <Avatar className="h-9 w-9 border border-primary/30 flex-shrink-0 overflow-hidden shadow-xs">
                                        <AvatarImage src={mentor.image} alt={mentor.name} className="object-cover w-full h-full" />
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                            {mentor.avatar}
                                        </AvatarFallback>
                                    </Avatar>
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
                                            toggleFollowMentor(mId, mentor.name);
                                        }}
                                        className={cn(
                                            "rounded-full h-7 text-xs font-semibold px-3 transition-all flex items-center gap-1.5",
                                            isFollowing 
                                                ? "bg-primary/20 text-primary border-primary/30" 
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
                ) : (
                    <div className="p-5 text-center flex flex-col items-center justify-center gap-1.5 border-t border-border/40">
                        <Users className="w-7 h-7 text-muted-foreground/40" />
                        <p className="text-xs font-semibold text-foreground">No mentors available</p>
                    </div>
                )}
            </div>

            {/* 5. Trending in Community */}
            <div className="flex flex-col rounded-2xl glass-card border border-white/10 overflow-hidden">
                <div onClick={() => router.push("/community")} className="px-4 pt-4 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <h3 className="text-base font-bold text-foreground">What&apos;s happening</h3>
                </div>

                {hashtags.length > 0 ? (
                    <div className="flex flex-col max-h-56 overflow-y-auto custom-scrollbar">
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
                ) : (
                    <div className="p-5 text-center flex flex-col items-center justify-center gap-1.5 border-t border-border/40">
                        <Hash className="w-7 h-7 text-muted-foreground/40" />
                        <p className="text-xs font-semibold text-foreground">No trending topics yet</p>
                        <p className="text-[11px] text-muted-foreground">Post in community to start trends.</p>
                    </div>
                )}
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
