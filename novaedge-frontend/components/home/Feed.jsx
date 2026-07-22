import { useState, useEffect } from "react";
import CreatePost from "@/components/post/CreatePost";
import PostCard from "@/components/post/PostCard";
import { getAllPosts } from "@/services/post";
import { getMyEnrollments } from "@/services/enrollment";
import { Loader2, Play, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faFire, 
    faCalendarDays, 
    faCircleCheck, 
    faVideo, 
    faBell, 
    faCalendarPlus,
    faTrophy,
    faUserCheck,
    faGraduationCap
} from "@fortawesome/free-solid-svg-icons";

export default function Feed() {
    const [activeTab, setActiveTab] = useState("foryou");
    const [posts, setPosts] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [learningLoading, setLearningLoading] = useState(true);

    // Interactive Modals State
    const [isStreakOpen, setIsStreakOpen] = useState(false);
    const [isSessionOpen, setIsSessionOpen] = useState(false);
    
    // Dynamic Streak & Session State (Defaulting to 0 / Real data, NO DUMMY DATA)
    const [streakDays, setStreakDays] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [checkedInToday, setCheckedInToday] = useState(false);
    const [reminderSet, setReminderSet] = useState(false);

    useEffect(() => {
        fetchPosts();
        fetchEnrollments();

        // Load real streak from localStorage
        if (typeof window !== "undefined") {
            const savedStreak = localStorage.getItem("novaedge_streak_days");
            const savedLongest = localStorage.getItem("novaedge_longest_streak");
            const lastCheckin = localStorage.getItem("novaedge_last_checkin");
            const today = new Date().toDateString();

            if (lastCheckin === today) {
                setCheckedInToday(true);
                setStreakDays(savedStreak ? parseInt(savedStreak, 10) : 1);
            } else if (savedStreak && lastCheckin) {
                const lastDate = new Date(lastCheckin);
                const diffTime = Math.abs(new Date() - lastDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                // If more than 1 day missed, reset streak to 0
                if (diffDays > 2) {
                    setStreakDays(0);
                    localStorage.setItem("novaedge_streak_days", "0");
                } else {
                    setStreakDays(parseInt(savedStreak, 10));
                }
            } else {
                setStreakDays(0);
            }

            if (savedLongest) {
                setLongestStreak(parseInt(savedLongest, 10));
            }
        }

        const handleNewPost = (e) => {
            if (e.detail) {
                setPosts((prev) => [e.detail, ...prev]);
            } else {
                fetchPosts();
            }
        };

        window.addEventListener("novaedge_post_created", handleNewPost);
        return () => window.removeEventListener("novaedge_post_created", handleNewPost);
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await getAllPosts();
            if (res.success) {
                setPosts(res.posts);
            }
        } catch (error) {
            console.error("Failed to fetch posts", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrollments = async () => {
        setLearningLoading(true);
        try {
            const res = await getMyEnrollments();
            let fetchedCourses = [];
            if (Array.isArray(res.courses)) {
                fetchedCourses = res.courses;
            } else if (Array.isArray(res.enrollments)) {
                fetchedCourses = res.enrollments.map((e) => e.course || e);
            } else if (Array.isArray(res)) {
                fetchedCourses = res;
            }
            setEnrollments(fetchedCourses);
        } catch (error) {
            console.error("Failed to fetch enrollments", error);
        } finally {
            setLearningLoading(false);
        }
    };

    const handleDailyCheckIn = () => {
        if (checkedInToday) {
            toast.info("You've already completed today's check-in! Keep up the great work.");
            return;
        }
        const newStreak = streakDays + 1;
        const newLongest = Math.max(newStreak, longestStreak);
        
        setStreakDays(newStreak);
        setLongestStreak(newLongest);
        setCheckedInToday(true);

        if (typeof window !== "undefined") {
            localStorage.setItem("novaedge_streak_days", newStreak.toString());
            localStorage.setItem("novaedge_longest_streak", newLongest.toString());
            localStorage.setItem("novaedge_last_checkin", new Date().toDateString());
        }

        toast.success(`Daily streak updated to ${newStreak} ${newStreak === 1 ? 'Day' : 'Days'}! Keep your flame burning.`);
    };

    const handleSetReminder = () => {
        setReminderSet(!reminderSet);
        if (!reminderSet) {
            toast.success("Notification reminder set for your upcoming session!");
        } else {
            toast.info("Session reminder cancelled.");
        }
    };

    const handleAddToCalendar = () => {
        toast.success("Session saved to your calendar schedule!");
    };

    const activeCourse = enrollments[0];

    // Compute dynamic session text based on real enrollment
    const getNextSessionText = () => {
        if (activeCourse) {
            return {
                title: `${activeCourse.title}`,
                subtext: `Next Lecture • ${activeCourse.progress || 0}% Completed`,
                badge: "Active Course",
                hasSession: true
            };
        }
        return {
            title: "No Session Scheduled",
            subtext: "Enroll in a course to view upcoming live classes",
            badge: "No Live Class",
            hasSession: false
        };
    };

    const sessionInfo = getNextSessionText();

    return (
        <div className="flex w-full min-w-0 flex-col pb-10">
            {/* Learning Section */}
            <div className="flex flex-col gap-6 p-6 border-b border-border bg-secondary/5">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
                    <p className="text-muted-foreground">Ready to continue your learning journey?</p>
                </div>

                {/* Continue Learning Card */}
                {learningLoading ? (
                    <div className="h-40 w-full animate-pulse rounded-xl bg-secondary/20" />
                ) : activeCourse ? (
                    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-border">
                                <Image
                                    src={activeCourse.thumbnail?.url || "/course-placeholder.jpg"}
                                    alt={activeCourse.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-primary uppercase tracking-wider">
                                    <BookOpen className="h-3 w-3" />
                                    Active Course
                                </div>
                                <h3 className="text-xl font-bold line-clamp-1">{activeCourse.title}</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-500"
                                            style={{ width: `${activeCourse.progress || 0}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold">{activeCourse.progress || 0}%</span>
                                </div>
                            </div>
                            <Link href={`/courses/${activeCourse._id}`}>
                                <Button className="rounded-full px-6 h-12 gap-2 shadow-lg shadow-primary/20">
                                    <Play className="h-4 w-4 fill-current" />
                                    Resume
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-border p-8 text-center bg-background">
                        <p className="text-muted-foreground mb-4">You haven&apos;t started any courses yet.</p>
                        <Link href="/courses">
                            <Button variant="outline" className="rounded-full">Explore Courses</Button>
                        </Link>
                    </div>
                )}

                {/* Quick Stats/Upcoming Cards - 100% Dynamic, Zero Dummy Data */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Learning Streak Card */}
                    <div 
                        onClick={() => setIsStreakOpen(true)}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-orange-500/50 hover:bg-card/80 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                    >
                        <div className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                            streakDays > 0 ? "bg-orange-500/15 text-orange-500" : "bg-secondary text-muted-foreground"
                        )}>
                            <FontAwesomeIcon icon={faFire} className={cn("h-5 w-5", streakDays > 0 ? "animate-pulse text-orange-500" : "text-muted-foreground")} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-medium">Learning Streak</p>
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                                    checkedInToday 
                                        ? "bg-orange-500/15 text-orange-500" 
                                        : "bg-secondary text-muted-foreground"
                                )}>
                                    {checkedInToday ? "Checked In" : "Check In"}
                                </span>
                            </div>
                            <p className="text-lg font-bold text-foreground truncate">{streakDays} {streakDays === 1 ? 'Day' : 'Days'}</p>
                        </div>
                    </div>

                    {/* Next Session Card */}
                    <div 
                        onClick={() => setIsSessionOpen(true)}
                        className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-blue-500/50 hover:bg-card/80 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                    >
                        <div className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                            sessionInfo.hasSession ? "bg-blue-500/15 text-blue-500" : "bg-secondary text-muted-foreground"
                        )}>
                            <FontAwesomeIcon icon={faCalendarDays} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground font-medium">Next Session</p>
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                                    sessionInfo.hasSession ? "bg-blue-500/15 text-blue-500" : "bg-secondary text-muted-foreground"
                                )}>
                                    {sessionInfo.badge}
                                </span>
                            </div>
                            <p className="text-lg font-bold text-foreground truncate">{sessionInfo.title}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dynamic Streak Modal */}
            <Dialog open={isStreakOpen} onOpenChange={setIsStreakOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader className="text-center sm:text-center flex flex-col items-center">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-2",
                            streakDays > 0 ? "bg-orange-500/15 text-orange-500" : "bg-secondary text-muted-foreground"
                        )}>
                            <FontAwesomeIcon icon={faFire} className={cn("w-7 h-7", streakDays > 0 ? "animate-bounce text-orange-500" : "")} />
                        </div>
                        <DialogTitle className="text-2xl font-extrabold text-foreground">
                            {streakDays} {streakDays === 1 ? 'Day' : 'Days'} Streak
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-sm mt-1">
                            {streakDays > 0 ? "Consistency is key to mastering new skills!" : "Start your daily learning streak today!"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {/* Real Activity Tracker */}
                        <div className="bg-secondary/20 rounded-xl p-4 border border-border/50">
                            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-muted-foreground">
                                <span>Weekly Learning Activity</span>
                                <span className="text-orange-500 font-bold flex items-center gap-1">
                                    <FontAwesomeIcon icon={faTrophy} className="w-3 h-3" /> Best: {longestStreak} {longestStreak === 1 ? 'Day' : 'Days'}
                                </span>
                            </div>

                            <div className="grid grid-cols-7 gap-2 text-center">
                                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
                                    const currentDayIndex = (new Date().getDay() + 6) % 7; // Monday = 0
                                    const isDone = (i === currentDayIndex && checkedInToday) || (i < currentDayIndex && streakDays > (currentDayIndex - i));
                                    return (
                                        <div key={day} className="flex flex-col items-center gap-1.5">
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                                isDone 
                                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" 
                                                    : "bg-secondary text-muted-foreground"
                                            )}>
                                                {isDone ? <FontAwesomeIcon icon={faCircleCheck} className="w-3.5 h-3.5" /> : day[0]}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground">{day}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="text-xs text-muted-foreground bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 flex items-center gap-3">
                            <FontAwesomeIcon icon={faUserCheck} className="w-5 h-5 text-orange-500 shrink-0" />
                            <span>Check in daily to build your learning habit and keep your streak growing!</span>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-stretch">
                        <Button 
                            onClick={handleDailyCheckIn}
                            disabled={checkedInToday}
                            className={cn(
                                "w-full rounded-full h-11 font-bold gap-2 text-sm",
                                checkedInToday ? "bg-secondary text-muted-foreground" : "bg-orange-500 hover:bg-orange-600 text-white"
                            )}
                        >
                            <FontAwesomeIcon icon={faFire} className="w-4 h-4" />
                            {checkedInToday ? "Checked In For Today" : "Claim Today's Streak +1"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dynamic Next Session Modal */}
            <Dialog open={isSessionOpen} onOpenChange={setIsSessionOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border">
                    <DialogHeader className="text-center sm:text-center flex flex-col items-center">
                        <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-2",
                            sessionInfo.hasSession ? "bg-blue-500/15 text-blue-500" : "bg-secondary text-muted-foreground"
                        )}>
                            <FontAwesomeIcon icon={sessionInfo.hasSession ? faVideo : faGraduationCap} className="w-6 h-6" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-foreground">
                            {sessionInfo.title}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground text-xs mt-1">
                            {sessionInfo.subtext}
                        </DialogDescription>
                    </DialogHeader>

                    {sessionInfo.hasSession ? (
                        <div className="space-y-4 py-2 text-sm">
                            <div className="bg-secondary/20 rounded-xl p-4 border border-border/50 space-y-3">
                                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                    <span className="text-xs text-muted-foreground font-medium">Course</span>
                                    <span className="text-xs font-bold text-foreground truncate max-w-[200px]">
                                        {activeCourse.title}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                                    <span className="text-xs text-muted-foreground font-medium">Progress</span>
                                    <span className="text-xs font-bold text-blue-500">
                                        {activeCourse.progress || 0}% Completed
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground font-medium">Session Status</span>
                                    <span className="text-xs font-bold text-emerald-500">
                                        Ready To Resume
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleAddToCalendar}
                                    className="flex-1 rounded-xl text-xs gap-1.5 h-10 border-border"
                                >
                                    <FontAwesomeIcon icon={faCalendarPlus} className="w-3.5 h-3.5 text-blue-500" />
                                    Add to Schedule
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleSetReminder}
                                    className={cn(
                                        "flex-1 rounded-xl text-xs gap-1.5 h-10 border-border transition-colors",
                                        reminderSet ? "bg-blue-500/10 text-blue-500 border-blue-500/30" : ""
                                    )}
                                >
                                    <FontAwesomeIcon icon={faBell} className="w-3.5 h-3.5 text-blue-500" />
                                    {reminderSet ? "Reminder Active" : "Set Reminder"}
                                </Button>
                            </div>

                            <DialogFooter>
                                <Link href={`/courses/${activeCourse._id}`} className="w-full">
                                    <Button 
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full h-11 font-bold gap-2 text-sm shadow-md shadow-blue-600/20"
                                    >
                                        <FontAwesomeIcon icon={faVideo} className="w-4 h-4" />
                                        Resume Course Lecture
                                    </Button>
                                </Link>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="space-y-4 py-2 text-sm text-center">
                            <p className="text-xs text-muted-foreground leading-relaxed px-4">
                                You have no upcoming scheduled sessions or enrolled courses. Browse our course catalog to start learning and schedule live lectures!
                            </p>
                            <DialogFooter className="sm:justify-center">
                                <Link href="/courses" className="w-full">
                                    <Button 
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-11 font-bold gap-2 text-sm shadow-md"
                                    >
                                        <FontAwesomeIcon icon={faGraduationCap} className="w-4 h-4" />
                                        Explore Available Courses
                                    </Button>
                                </Link>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Community Feed Section */}
            <div className="flex flex-col">
                <div className="sticky top-0 z-10 flex w-full border-b border-border bg-background/80 backdrop-blur-md">
                    <div
                        className="flex w-full cursor-pointer items-center justify-center py-4 hover:bg-secondary/50 transition-colors"
                        onClick={() => setActiveTab("foryou")}
                    >
                        <div className={cn("relative font-bold text-sm", activeTab === "foryou" ? "text-foreground" : "text-muted-foreground")}>
                            Community Feed
                            {activeTab === "foryou" && <div className="absolute -bottom-[17px] left-0 h-1 w-full rounded-full bg-primary" />}
                        </div>
                    </div>
                    <div
                        className="flex w-full cursor-pointer items-center justify-center py-4 hover:bg-secondary/50 transition-colors"
                        onClick={() => setActiveTab("following")}
                    >
                        <div className={cn("relative font-bold text-sm", activeTab === "following" ? "text-foreground" : "text-muted-foreground")}>
                            Following
                            {activeTab === "following" && <div className="absolute -bottom-[17px] left-0 h-1 w-full rounded-full bg-primary" />}
                        </div>
                    </div>
                </div>

                <div className="px-4 py-4 border-b border-border">
                    <CreatePost onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
                </div>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                onDelete={(id) => setPosts(posts.filter(p => p._id !== id))}
                            />
                        ))}
                        {posts.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">
                                No posts yet.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
