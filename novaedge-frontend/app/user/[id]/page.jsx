"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getUserPosts } from "@/services/post";
import PostCard from "@/components/post/PostCard";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, UserX, ArrowLeft, Mail, Award, Sparkles, Github, Linkedin, Globe, Twitter } from "lucide-react";
import FriendActionButton from "@/components/friend/FriendActionButton";
import { useAuth } from "@/context/auth-context";

export default function PublicProfilePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user: currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiGet(`/api/v1/user/${id}`);
                if (res.success) {
                    setUser({ ...res.user, certificates: res.certificates || [] });
                } else {
                    setError(res.message || "User not found");
                }

                if (res.success && res.user) {
                    const postsRes = await getUserPosts(res.user._id).catch(() => ({ success: false }));
                    if (postsRes.success && Array.isArray(postsRes.posts)) {
                        setPosts(postsRes.posts);
                    }
                }
            } catch (err) {
                setError(err?.response?.data?.message || err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    if (loading) {
        return (
            <AppLayout className="max-w-2xl xl:max-w-3xl border-r border-border p-0">
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    if (error || !user) {
        return (
            <AppLayout className="max-w-2xl xl:max-w-3xl border-r border-border p-0">
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                    <div className="h-16 w-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4">
                        <UserX className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Profile Not Found</h1>
                    <p className="text-muted-foreground text-sm max-w-sm mb-6">{error || "The user you are looking for does not exist."}</p>
                    <Button onClick={() => router.push("/community")} className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Community
                    </Button>
                </div>
            </AppLayout>
        );
    }

    const displayRole = (user.role === "admin" && (user.email?.toLowerCase().includes("admin") || user.isAdmin))
        ? "Admin"
        : user.role === "mentor"
        ? "Mentor"
        : "Student";

    return (
        <AppLayout className="max-w-2xl xl:max-w-3xl border-r border-border p-0 sm:pb-0">
            {/* Top Navigation Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-2 flex items-center gap-4 border-b border-border">
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-lg font-bold leading-5">{user.name}</h1>
                    <p className="text-xs text-muted-foreground">{posts.length} Posts · {user.certificates?.length || 0} Certificates</p>
                </div>
            </div>

            {/* Full-width Cover Image */}
            <div className="h-44 sm:h-52 bg-muted relative overflow-hidden">
                {user.coverImage?.url ? (
                    <img
                        src={user.coverImage.url}
                        alt="Profile Cover"
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-primary/20" />
                    </div>
                )}
            </div>

            {/* Profile Header Details */}
            <div className="px-4 pb-4 relative">
                <div className="flex justify-between items-start">
                    <div className="-mt-16 mb-3">
                        <Avatar className="w-28 h-28 sm:w-32 sm:h-32 border-4 border-background shadow-lg overflow-hidden">
                            <AvatarImage src={user.avatar?.url} alt={user.name} className="object-cover object-center w-full h-full" />
                            <AvatarFallback className="text-3xl font-bold bg-primary/15 text-primary">{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>

                    {/* Friend / Connect Button */}
                    {currentUser && currentUser._id !== user._id && (
                        <div className="mt-3">
                            <FriendActionButton otherUserId={user._id} />
                        </div>
                    )}
                </div>

                <div className="mb-2">
                    <h2 className="text-xl font-bold leading-6 text-foreground">{user.name}</h2>
                    {user.username && (
                        <p className="text-muted-foreground text-sm">@{user.username}</p>
                    )}
                </div>

                {/* User Bio */}
                {user.bio && (
                    <p className="text-sm text-foreground/95 mb-3 leading-relaxed whitespace-pre-line">{user.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
                    <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
                        {displayRole}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : "Recently"}</span>
                    </div>

                    {user.email && (
                        <div className="flex items-center gap-1.5 text-xs">
                            <Mail className="w-3.5 h-3.5 text-primary" />
                            <span className="truncate max-w-[220px]" title={user.email}>{user.email}</span>
                        </div>
                    )}

                    {/* Social Links */}
                    {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
                        <div className="flex items-center gap-2 ml-auto">
                            {user.socialLinks.github && (
                                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="GitHub">
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                            {user.socialLinks.linkedin && (
                                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="LinkedIn">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                            {user.socialLinks.portfolio && (
                                <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="Portfolio">
                                    <Globe className="w-4 h-4" />
                                </a>
                            )}
                            {user.socialLinks.twitter && (
                                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-full bg-secondary/50 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="Twitter / X">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex gap-6 text-sm mb-2 border-t border-border/40 pt-3">
                    <div className="hover:underline cursor-pointer">
                        <span className="font-bold text-foreground">{posts.length}</span> <span className="text-muted-foreground text-xs">Posts</span>
                    </div>
                    <div className="hover:underline cursor-pointer">
                        <span className="font-bold text-foreground">{user.certificates?.length || 0}</span> <span className="text-muted-foreground text-xs">Certificates</span>
                    </div>
                </div>
            </div>

            {/* Profile Content Tabs */}
            <Tabs defaultValue="posts" className="w-full">
                <TabsList className="w-full justify-start bg-transparent border-b border-border/60 rounded-none h-auto p-0">
                    <TabsTrigger
                        value="posts"
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-4 h-4 text-primary" />
                        Posts ({posts.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="certificates"
                        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 font-bold text-muted-foreground data-[state=active]:text-foreground hover:bg-muted/30 transition-colors flex items-center justify-center gap-2"
                    >
                        <Award className="w-4 h-4 text-primary" />
                        Certificates ({user.certificates?.length || 0})
                    </TabsTrigger>
                </TabsList>

                {/* Posts Tab */}
                <TabsContent value="posts" className="p-0 m-0">
                    {posts.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <Sparkles className="w-10 h-10 text-primary/40 mx-auto mb-3" />
                            <h3 className="font-bold text-base text-foreground mb-1">No posts yet</h3>
                            <p className="text-muted-foreground text-xs max-w-xs mx-auto">
                                User has not published any public posts yet.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border/60">
                            {posts.map((post) => (
                                <PostCard
                                    key={post._id}
                                    post={post}
                                    onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                {/* Certificates Tab */}
                <TabsContent value="certificates" className="p-4 m-0">
                    {!user.certificates || user.certificates.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-sm">No certificates earned yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {user.certificates.map((cert) => (
                                <div key={cert._id} className="flex items-center justify-between p-4 border border-border/60 rounded-xl hover:bg-muted/30 transition-colors">
                                    <div>
                                        <p className="font-bold text-sm text-foreground">{cert.course?.title || "Course Certificate"}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Issued on {new Date(cert.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    <Button variant="outline" size="sm" asChild className="rounded-full">
                                        <a href={`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/certificate/${cert.certificateId}/download`} target="_blank" rel="noopener noreferrer">
                                            Download
                                        </a>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </AppLayout>
    );
}
