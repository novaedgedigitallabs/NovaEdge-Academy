"use client";

import { useState, useEffect } from "react";
import CreatePost from "@/components/post/CreatePost";
import PostCard from "@/components/post/PostCard";
import { getAllPosts } from "@/services/post";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Feed() {
    const [activeTab, setActiveTab] = useState("foryou");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
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

    return (
        <div className="flex w-full min-w-0 flex-col border-x border-border pb-10 sm:w-[600px]">
            <div className="sticky top-0 z-10 flex w-full border-b border-border bg-background/80 backdrop-blur-md">
                <div
                    className="flex w-full cursor-pointer items-center justify-center py-4 hover:bg-secondary/50 transition-colors"
                    onClick={() => setActiveTab("foryou")}
                >
                    <div className={cn("relative font-bold text-sm", activeTab === "foryou" ? "text-foreground" : "text-muted-foreground")}>
                        For you
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

            <div className="flex flex-col">
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
