"use client";

import React, { useEffect, useState, use } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { getPost } from "@/services/blogs";
import { getRssPostByIdOrSlug } from "@/services/rss";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";

export default function BlogPostPage({ params }) {
    const { id } = use(params);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await getPost(id).catch(() => null);
                if (res?.data || res?.post) {
                    setPost(res.data || res.post);
                } else {
                    const rssPost = await getRssPostByIdOrSlug(id);
                    if (rssPost) {
                        setPost(rssPost);
                    }
                }
            } catch (error) {
                const rssPost = await getRssPostByIdOrSlug(id);
                if (rssPost) {
                    setPost(rssPost);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <AppLayout>
                <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                    <div className="text-center font-medium text-muted-foreground">Loading article...</div>
                </div>
            </AppLayout>
        );
    }

    if (!post) {
        return (
            <AppLayout>
                <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
                    <h1 className="text-2xl font-bold">Article Not Found</h1>
                    <Link href="/blog">
                        <Button className="rounded-full">Back to Blog</Button>
                    </Link>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-background text-foreground pb-20">
                {/* Hero Section with Image */}
                <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden border-b border-border/40 bg-black/40">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
                    <img
                        src={post.image}
                        alt={post.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/Header_logo.webp"; }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 z-20 container mx-auto px-6 pb-8">
                        <Link href="/blog">
                            <Button variant="ghost" size="sm" className="mb-4 text-foreground/90 hover:text-foreground hover:bg-background/40 rounded-full">
                                <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog
                            </Button>
                        </Link>
                        <Badge className="mb-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3">
                            {post.category || "Technology"}
                        </Badge>
                        <h1 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight text-foreground max-w-4xl leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-foreground/80 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    <User className="w-3.5 h-3.5" />
                                </div>
                                <span>{post.author || "NovaEdge Digital Labs"}</span>
                            </div>
                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-primary" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> {post.readTime || "5 min read"}</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <article className="container mx-auto px-6 py-10 max-w-3xl">
                    <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed space-y-4">
                        {post.content ? (
                            <div
                                className="space-y-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_li]:text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        ) : (
                            <p className="text-base text-muted-foreground">{post.excerpt}</p>
                        )}
                    </div>
                </article>
            </div>
        </AppLayout>
    );
}
