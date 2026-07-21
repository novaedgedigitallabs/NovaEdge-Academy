import { useState, useEffect } from "react";
import CreatePost from "@/components/post/CreatePost";
import PostCard from "@/components/post/PostCard";
import { getAllPosts } from "@/services/post";
import { getMyEnrollments } from "@/services/enrollment";
import { Loader2, Play, Flame, Calendar, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Feed() {
    const [activeTab, setActiveTab] = useState("foryou");
    const [posts, setPosts] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [learningLoading, setLearningLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
        fetchEnrollments();
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

    const activeCourse = enrollments[0]; // Assuming the first one is the most recent/active

    return (
        <div className="flex w-full min-w-0 flex-col border-x border-border pb-10 sm:w-[600px] lg:w-[700px]">
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
                                            style={{ width: `${activeCourse.progress || 45}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-bold">{activeCourse.progress || 45}%</span>
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

                {/* Quick Stats/Upcoming */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
                            <Flame className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Learning Streak</p>
                            <p className="text-lg font-bold">12 Days</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Next Session</p>
                            <p className="text-lg font-bold">Tomorrow, 10 AM</p>
                        </div>
                    </div>
                </div>
            </div>

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
