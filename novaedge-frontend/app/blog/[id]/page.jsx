"use client";

import React, { useEffect, useState, use } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPost } from "@/services/blogs";
import { getRssPostByIdOrSlug } from "@/services/rss";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faArrowLeft, 
    faCalendarDays, 
    faClock, 
    faUser 
} from "@fortawesome/free-solid-svg-icons";

export default function BlogPostPage({ params }) {
    const { id } = use(params);
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                // Try RSS first since dynamic articles come from RSS
                const rssPost = await getRssPostByIdOrSlug(id);
                if (rssPost) {
                    setPost(rssPost);
                } else {
                    const res = await getPost(id).catch(() => null);
                    if (res?.data || res?.post) {
                        setPost(res.data || res.post);
                    }
                }
            } catch (error) {
                console.error("Failed to load post", error);
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
                            <Button variant="ghost" size="sm" className="mb-4 text-foreground/90 hover:text-foreground hover:bg-background/40 rounded-full gap-2">
                                <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" /> Back to Blog
                            </Button>
                        </Link>
                        <Badge className="mb-3 bg-secondary text-foreground border-border rounded-full px-3">
                            {post.category || "Technology"}
                        </Badge>
                        <h1 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight text-foreground max-w-4xl leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-foreground/80 font-medium">
                            <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-bold">
                                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                </div>
                                <span>{post.author || "NovaEdge Digital Labs"}</span>
                            </div>
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faCalendarDays} className="w-3 h-3 text-muted-foreground" /> 
                                {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-muted-foreground" /> 
                                {post.readTime || "5 min read"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <article className="container mx-auto px-6 py-10 max-w-3xl">
                    <div className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed">
                        {post.content ? (
                            <div
                                className="space-y-6 text-muted-foreground text-base leading-relaxed 
                                           [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-foreground [&_h1]:mt-8 [&_h1]:mb-4
                                           [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4
                                           [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-3
                                           [&_p]:mb-4 [&_p]:leading-relaxed
                                           [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                                           [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
                                           [&_li]:text-muted-foreground
                                           [&_strong]:text-foreground [&_strong]:font-semibold
                                           [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4
                                           [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/90
                                           [&_code]:bg-secondary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        ) : (
                            <p className="text-base text-muted-foreground leading-relaxed">{post.excerpt}</p>
                        )}
                    </div>
                </article>
            </div>
        </AppLayout>
    );
}
