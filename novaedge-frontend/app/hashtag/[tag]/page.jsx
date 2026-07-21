"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/post/PostCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Hash, Users, MousePointerClick, Eye, ArrowLeft } from "lucide-react";

export default function HashtagPage() {
    const { tag } = useParams();
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user && !authLoading) {
            router.push("/login");
            return;
        }

        if (user) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const base = process.env.NEXT_PUBLIC_API_URL || "";
                    const res = await fetch(`${base}/api/v1/hashtag/${tag}`, {
                        credentials: "include"
                    });
                    const data = await res.json();

                    if (data.success) {
                        setPosts(data.posts);
                        setStats(data.stats);
                    } else {
                        console.error("Hashtag fetch error:", data.message);
                        setError(data.message || "Failed to load hashtag data");
                    }
                } catch (err) {
                    console.error("Hashtag page error:", err);
                    setError(err.message || "Something went wrong");
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        }
    }, [tag, user, authLoading, router]);

    if (authLoading || !user) return null;

    return (
        <AppLayout className="max-w-2xl xl:max-w-3xl border-r border-border p-0 sm:pb-0">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-border">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-xl font-bold leading-6">#{tag}</h1>
                    <p className="text-xs text-muted-foreground">{stats?.postsCount || 0} posts</p>
                </div>
            </div>

            {/* Analytics Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-border bg-muted/10">
                    <div className="flex flex-col items-center p-3 rounded-xl bg-background border border-border">
                        <Users className="w-5 h-5 text-blue-500 mb-1" />
                        <span className="text-lg font-bold">{stats.usersCount}</span>
                        <span className="text-xs text-muted-foreground">Users</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-xl bg-background border border-border">
                        <MousePointerClick className="w-5 h-5 text-green-500 mb-1" />
                        <span className="text-lg font-bold">{stats.clicks}</span>
                        <span className="text-xs text-muted-foreground">Clicks</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-xl bg-background border border-border">
                        <Eye className="w-5 h-5 text-purple-500 mb-1" />
                        <span className="text-lg font-bold">{stats.impressions}</span>
                        <span className="text-xs text-muted-foreground">Impressions</span>
                    </div>
                    <div className="flex flex-col items-center p-3 rounded-xl bg-background border border-border">
                        <Hash className="w-5 h-5 text-orange-500 mb-1" />
                        <span className="text-lg font-bold">{stats.ctr}%</span>
                        <span className="text-xs text-muted-foreground">CTR</span>
                    </div>
                </div>
            )}

            {/* Feed */}
            <div className="flex flex-col">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-destructive">
                        <p>{error}</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                        <p>No posts found with #{tag}</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <PostCard
                            key={post._id}
                            post={post}
                            onDelete={(id) => setPosts(prev => prev.filter(p => p._id !== id))}
                        />
                    ))
                )}
            </div>
        </AppLayout>
    );
}
