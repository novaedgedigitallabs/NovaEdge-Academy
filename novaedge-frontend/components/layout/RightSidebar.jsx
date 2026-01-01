import { Search, Calendar, Trophy, UserPlus, TrendingUp, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RightSidebar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter" && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l border-gray-100 bg-white px-6 py-6 max-xl:hidden">
            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                    placeholder="Search NovaEdge"
                    className="rounded-full bg-gray-100 border-none pl-12 h-12 text-base focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            {/* Upcoming Schedule Widget */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="px-4 pt-4 mb-3">
                    <h3 className="text-xl font-extrabold text-gray-900">Upcoming Schedule</h3>
                </div>

                <div className="flex flex-col">
                    {[
                        { title: "Advanced React Workshop", date: "Dec 30", time: "10:00 AM", type: "Live Class" },
                        { title: "UI/UX Design Review", date: "Jan 02", time: "02:30 PM", type: "Mentorship" },
                        { title: "Career Growth Seminar", date: "Jan 05", time: "04:00 PM", type: "Webinar" }
                    ].map((event, i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-50 cursor-pointer">
                            <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-primary/5 text-primary flex-shrink-0">
                                <span className="text-[10px] font-bold uppercase">{event.date.split(' ')[0]}</span>
                                <span className="text-lg font-black leading-none">{event.date.split(' ')[1]}</span>
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 line-clamp-1">{event.title}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {event.time}
                                    </div>
                                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                                    <span>{event.type}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Link href="/schedule" className="p-4 text-sm font-medium text-primary hover:bg-gray-50 transition-colors border-t border-gray-50">
                    View full schedule
                </Link>
            </div>

            {/* Leaderboard Widget */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="px-4 pt-4 mb-3 flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-gray-900">Leaderboard</h3>
                    <Trophy className="h-5 w-5 text-yellow-500" />
                </div>

                <div className="flex flex-col">
                    {[
                        { name: "Alex Johnson", points: "2,450", rank: 1, avatar: "AJ" },
                        { name: "Sarah Chen", points: "2,120", rank: 2, avatar: "SC" },
                        { name: "Michael Ross", points: "1,980", rank: 3, avatar: "MR" }
                    ].map((student, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-50">
                            <div className="relative">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                                    {student.avatar}
                                </div>
                                <div className={cn(
                                    "absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white",
                                    student.rank === 1 ? "bg-yellow-400 text-white" :
                                        student.rank === 2 ? "bg-gray-300 text-white" : "bg-orange-400 text-white"
                                )}>
                                    {student.rank}
                                </div>
                            </div>
                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-bold text-gray-900">{student.name}</p>
                                <p className="text-xs text-gray-500">{student.points} XP</p>
                            </div>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                    ))}
                </div>
                <Link href="/leaderboard" className="p-4 text-sm font-medium text-primary hover:bg-gray-50 transition-colors border-t border-gray-50">
                    View all rankings
                </Link>
            </div>

            {/* Recommended Mentors */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="px-4 pt-4 mb-3">
                    <h3 className="text-xl font-extrabold text-gray-900">Recommended Mentors</h3>
                </div>

                <div className="flex flex-col">
                    {[
                        { name: "Sarah Drasner", role: "Frontend Expert", avatar: "SD" },
                        { name: "Guillermo Rauch", role: "Next.js Creator", avatar: "GR" }
                    ].map((mentor, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-t border-gray-50">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                                {mentor.avatar}
                            </div>
                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-bold text-gray-900">{mentor.name}</p>
                                <p className="text-xs text-gray-500">{mentor.role}</p>
                            </div>
                            <Button size="sm" variant="outline" className="rounded-full h-8 text-xs font-bold border-gray-200 hover:bg-gray-50">Follow</Button>
                        </div>
                    ))}
                </div>
                <Link href="/mentors" className="p-4 text-sm font-medium text-primary hover:bg-gray-50 transition-colors border-t border-gray-50">
                    Show more
                </Link>
            </div>

            {/* Trending in Community */}
            <div className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden">
                <div className="px-4 pt-4 mb-3">
                    <h3 className="text-xl font-extrabold text-gray-900">What&apos;s happening</h3>
                </div>

                <div className="flex flex-col">
                    {[
                        { tag: "#NextJS15", posts: "12.4K posts", category: "Technology" },
                        { tag: "#WebDesign", posts: "8.2K posts", category: "Design" },
                        { tag: "#NovaEdge", posts: "5.1K posts", category: "Education" }
                    ].map((item, i) => (
                        <div key={i} className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-t border-gray-50">
                            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-tight">{item.category} · Trending</p>
                            <p className="font-bold text-sm text-gray-900 mt-0.5">{item.tag}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.posts}</p>
                        </div>
                    ))}
                </div>
                <Link href="/community" className="p-4 text-sm font-medium text-primary hover:bg-gray-50 transition-colors border-t border-gray-50">
                    Show more
                </Link>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-4 text-[13px] text-gray-500">
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
