"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { getAllPosts } from "@/services/blogs";
import Link from "next/link";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [featuredPost, setFeaturedPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getAllPosts();
                const allPosts = res.data || [];
                if (allPosts.length > 0) {
                    setFeaturedPost(allPosts[0]);
                    setPosts(allPosts.slice(1));
                } else {
                    setPosts([]);
                }
            } catch (error) {
                console.error("Failed to load blog posts", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                <div className="container relative mx-auto px-4 text-center">
                    <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
                        Our Blog
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Insights & <span className="text-primary">Updates</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stay up to date with the latest trends in technology, education, and career development.
                    </p>

                    <div className="max-w-md mx-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                            placeholder="Search articles..."
                            className="pl-10 h-12 bg-card border-border focus:border-primary transition-colors"
                        />
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
                        <div className="grid md:grid-cols-2 gap-8 bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group">
                            <div className="relative h-64 md:h-auto overflow-hidden">
                                <img
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{featuredPost.category}</Badge>
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featuredPost.readTime}</span>
                                </div>
                                <h3 className="text-3xl font-bold mb-4 group-hover:text-primary transition-colors">{featuredPost.title}</h3>
                                <p className="text-muted-foreground mb-6 line-clamp-3">
                                    {featuredPost.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="text-sm font-medium">{featuredPost.author}</span>
                                    </div>
                                    <Link href={`/blog/${featuredPost._id}`}>
                                        <Button variant="link" className="text-primary p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform">
                                            Read Article <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Recent Posts Grid */}
            <section className="py-12 pb-24">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>

                    {loading ? (
                        <div className="text-center text-muted-foreground">Loading articles...</div>
                    ) : posts.length === 0 && !featuredPost ? (
                        <div className="text-center text-muted-foreground">No articles found.</div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post) => (
                                <Card key={post._id} className="bg-card border-border hover:border-primary/50 transition-colors group flex flex-col h-full overflow-hidden">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <Badge className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background/90">{post.category}</Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="p-6 pb-4">
                                        <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                                    </CardHeader>
                                    <CardContent className="p-6 pt-0 flex-grow">
                                        <p className="text-muted-foreground text-sm line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                                <User className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-medium">{post.author}</span>
                                        </div>
                                        <Link href={`/blog/${post._id}`}>
                                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10 -mr-2">
                                                Read <ArrowRight className="ml-1 w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
