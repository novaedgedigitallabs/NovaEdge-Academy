"use client";

import React, { useEffect, useState, use } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { getPost } from "@/services/blogs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "react-quill-new/dist/quill.snow.css"; // Import styles for content rendering

export default function BlogPostPage({ params }) {
    const { id } = use(params);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPost(id);
                setPost(res.data);
            } catch (error) {
                console.error("Failed to load post", error);
                // router.push("/blog"); // Optional: redirect on error
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
                <h1 className="text-2xl font-bold">Post not found</h1>
                <Link href="/blog">
                    <Button>Back to Blog</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Hero Section with Image */}
            <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent z-10" />
                <img
                    src={post.image}
                    alt={post.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-4 pb-12">
                    <Link href="/blog">
                        <Button variant="ghost" className="mb-6 text-foreground/80 hover:text-foreground hover:bg-background/20">
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog
                        </Button>
                    </Link>
                    <Badge className="mb-4 bg-primary text-primary-foreground hover:bg-primary/90">
                        {post.category}
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight max-w-4xl">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-foreground/80">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{post.author}</span>
                        </div>
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <article className="container mx-auto px-4 py-12 max-w-3xl">
                <div className="prose prose-lg prose-invert max-w-none">
                    {/* Render HTML content safely */}
                    <div
                        className="ql-editor p-0" // Use Quill's editor class for consistent styling
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>
        </div>
    );
}
