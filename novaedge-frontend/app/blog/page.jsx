"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getAllPosts } from "@/services/blogs";
import Link from "next/link";
import AppLayout from "@/components/layout/AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faMagnifyingGlass, 
    faCalendarDays, 
    faClock, 
    faArrowRight, 
    faUser,
    faNewspaper
} from "@fortawesome/free-solid-svg-icons";

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [featuredPost, setFeaturedPost] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getAllPosts();
                const allPosts = res?.data || res?.posts || (Array.isArray(res) ? res : []);

                if (allPosts.length > 0) {
                    setFeaturedPost(allPosts[0]);
                    setPosts(allPosts.slice(1));
                } else {
                    setFeaturedPost(null);
                    setPosts([]);
                }
            } catch (error) {
                console.error("Failed to load blog posts", error);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => 
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AppLayout>
            <div className="min-h-screen bg-background text-foreground">
                {/* Hero Section */}
                <section className="relative py-12 md:py-16 overflow-hidden border-b border-border/40">
                    <div className="container relative mx-auto px-4 text-center">
                        <div className="flex items-center justify-center mb-4">
                            <Badge variant="outline" className="border-border text-foreground px-3 py-1 text-xs font-semibold gap-1.5">
                                <FontAwesomeIcon icon={faNewspaper} className="w-3 h-3 text-primary" /> Official Blog
                            </Badge>
                        </div>

                        {/* Single Solid Text Color */}
                        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-foreground">
                            Blog & Articles
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
                            Stay up to date with the latest tutorials, technology trends, and platform announcements.
                        </p>

                        <div className="max-w-md mx-auto relative">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search articles, categories, or keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11 bg-card/60 border-border text-sm rounded-full"
                            />
                        </div>
                    </div>
                </section>

                {/* Featured Post */}
                {featuredPost && !searchQuery && (
                    <section className="py-8 px-4">
                        <div className="container mx-auto max-w-6xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                                Featured Article
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6 bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors group shadow-lg">
                                <div className="relative h-56 md:h-full min-h-[240px] overflow-hidden bg-black/40">
                                    <img
                                        src={featuredPost.image || "/logo2.png"}
                                        alt={featuredPost.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { e.target.src = "/logo2.png"; }}
                                    />
                                </div>
                                <div className="p-6 md:p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs text-muted-foreground">
                                            <Badge className="bg-secondary text-foreground border-border">
                                                {featuredPost.category || "Technology"}
                                            </Badge>
                                            <span className="flex items-center gap-1.5">
                                                <FontAwesomeIcon icon={faCalendarDays} className="w-3 h-3" /> 
                                                {new Date(featuredPost.createdAt || Date.now()).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <FontAwesomeIcon icon={faClock} className="w-3 h-3" /> {featuredPost.readTime || "5 min read"}
                                            </span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors leading-snug">
                                            {featuredPost.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-foreground text-xs font-bold">
                                                <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-medium text-foreground">{featuredPost.author || "Admin"}</span>
                                        </div>

                                        <Link href={`/blog/${featuredPost._id}`}>
                                            <Button size="sm" className="rounded-full text-xs font-bold gap-1.5">
                                                Read Article <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Articles Grid */}
                <section className="py-8 pb-20 px-4">
                    <div className="container mx-auto max-w-6xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-foreground">
                                {searchQuery ? `Search Results (${filteredPosts.length})` : "Recent Articles"}
                            </h2>
                            <span className="text-xs text-muted-foreground font-medium">
                                Showing {filteredPosts.length} articles
                            </span>
                        </div>

                        {loading ? (
                            <div className="py-16 text-center text-muted-foreground flex flex-col items-center gap-3">
                                <FontAwesomeIcon icon={faNewspaper} className="w-8 h-8 animate-pulse text-primary" />
                                <p className="text-sm">Loading articles...</p>
                            </div>
                        ) : filteredPosts.length === 0 && !featuredPost ? (
                            <div className="py-16 text-center text-muted-foreground bg-card/40 rounded-2xl border border-border/60 max-w-md mx-auto p-8">
                                <FontAwesomeIcon icon={faNewspaper} className="w-10 h-10 text-muted-foreground mb-3" />
                                <p className="text-base font-semibold text-foreground">No blog posts available yet</p>
                                <p className="text-xs mt-1 text-muted-foreground">Articles added manually from the admin dashboard will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredPosts.map((post) => (
                                    <Card key={post._id} className="bg-card/60 border-border/60 hover:border-primary/50 transition-all group flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md">
                                        <div className="relative h-44 overflow-hidden bg-black/40">
                                            <img
                                                src={post.image || "/logo2.png"}
                                                alt={post.title}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                onError={(e) => { e.target.src = "/logo2.png"; }}
                                            />
                                            <div className="absolute top-3 left-3">
                                                <Badge className="bg-background/90 backdrop-blur-sm text-foreground text-[11px] font-semibold">
                                                    {post.category || "Blog"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardHeader className="p-5 pb-3">
                                            <div className="flex items-center gap-3 mb-2 text-[11px] text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <FontAwesomeIcon icon={faCalendarDays} className="w-3 h-3" /> 
                                                    {new Date(post.createdAt || Date.now()).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <FontAwesomeIcon icon={faClock} className="w-3 h-3" /> 
                                                    {post.readTime || "5 min read"}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                                {post.title}
                                            </h3>
                                        </CardHeader>
                                        <CardContent className="px-5 py-0 flex-grow">
                                            <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        </CardContent>
                                        <CardFooter className="p-5 pt-4 mt-auto flex items-center justify-between border-t border-border/40">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-foreground text-[10px] font-bold">
                                                    <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                                </div>
                                                <span className="text-[11px] font-medium text-muted-foreground truncate max-w-[120px]">
                                                    {post.author || "Admin"}
                                                </span>
                                            </div>

                                            <Link href={`/blog/${post._id}`}>
                                                <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 -mr-2 text-xs gap-1 font-semibold">
                                                    Read <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
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
        </AppLayout>
    );
}
