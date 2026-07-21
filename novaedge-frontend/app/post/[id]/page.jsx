"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/post/PostCard";
import { apiGet } from "@/lib/api";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SinglePostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchPost = async () => {
            setLoading(true);
            try {
                const data = await apiGet(`/api/v1/posts/${id}`);
                if (data.success) {
                    setPost(data.post);
                } else {
                    setError(data.message || "Post not found");
                }
            } catch (err) {
                setError(err.message || "Failed to load post");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = () => {
        setPost(null);
        setError("Post has been deleted.");
    };

    return (
        <AppLayout>
            <div>
                {/* Back button header */}
                <div className="sticky top-0 z-10 flex items-center gap-4 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-lg font-bold">Post</h1>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground text-sm mb-4">{error}</p>
                        <Button asChild className="rounded-full px-6">
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                )}

                {/* Post */}
                {post && !loading && !error && (
                    <PostCard post={post} onDelete={handleDelete} />
                )}
            </div>
        </AppLayout>
    );
}
