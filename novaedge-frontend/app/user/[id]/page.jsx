"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getUserPosts } from "@/services/post";
import PostCard from "@/components/post/PostCard";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, UserX, ArrowLeft, Mail, Award, Shield, Sparkles, Github, Linkedin, Globe, Twitter } from "lucide-react";
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
            <AppLayout>
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AppLayout>
        );
    }

    if (error || !user) {
        return (
            <AppLayout>
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

    return (
        <AppLayout>
            <div className="px-4 py-6 max-w-5xl mx-auto space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: User Info Card */}
                    <div className="md:col-span-1">
                        <Card className="p-0 bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl shadow-xl overflow-hidden flex flex-col">
                            {/* Decorative Cover Header */}
                            <div className="h-24 bg-muted relative overflow-hidden">
                                {user.coverImage?.url ? (
                                    <img src={user.coverImage.url} alt="Cover Banner" className="w-full h-full object-cover object-center" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900/80" />
                                )}
                            </div>

                            <div className="px-6 pb-6 pt-0 flex flex-col items-center -mt-10 text-center">
                                <Avatar className="w-24 h-24 mb-3 border-4 border-background shadow-lg">
                                    <AvatarImage src={user.avatar?.url || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback className="text-3xl font-bold bg-primary/15 text-primary">
                                        {user.name?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>

                                <h1 className="text-xl font-bold text-foreground line-clamp-1">{user.name}</h1>
                                {user.username && (
                                    <p className="text-xs text-muted-foreground mb-2">@{user.username}</p>
                                )}

                                <Badge variant="secondary" className="text-xs font-semibold px-3 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize mb-4">
                                    {user.role || "Student"}
                                </Badge>

                                {currentUser && currentUser._id !== user._id && (
                                    <div className="w-full mb-4">
                                        <FriendActionButton otherUserId={user._id} />
                                    </div>
                                )}

                                {/* User Details */}
                                <div className="w-full space-y-3 text-left border-t border-border/40 pt-4 text-xs">
                                    <div className="flex items-center text-muted-foreground">
                                        <Calendar className="w-4 h-4 mr-2.5 shrink-0 text-primary" />
                                        <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recently"}</span>
                                    </div>

                                    {user.email && (
                                        <div className="flex items-start text-muted-foreground">
                                            <Mail className="w-4 h-4 mr-2.5 mt-0.5 shrink-0 text-primary" />
                                            <span className="font-medium text-foreground/90 break-words line-clamp-2" title={user.email}>
                                                {user.email}
                                            </span>
                                        </div>
                                    )}

                                    {user.certificates && user.certificates.length > 0 && (
                                        <div className="flex items-center text-muted-foreground">
                                            <Award className="w-4 h-4 mr-2.5 shrink-0 text-primary" />
                                            <span>{user.certificates.length} {user.certificates.length === 1 ? 'Certificate' : 'Certificates'} Earned</span>
                                        </div>
                                    )}

                                    {/* Social Links */}
                                    {user.socialLinks && Object.values(user.socialLinks).some(Boolean) && (
                                        <div className="pt-2 border-t border-border/40 flex flex-wrap items-center justify-center gap-2">
                                            {user.socialLinks.github && (
                                                <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/40 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="GitHub">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {user.socialLinks.linkedin && (
                                                <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/40 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="LinkedIn">
                                                    <Linkedin className="w-4 h-4" />
                                                </a>
                                            )}
                                            {user.socialLinks.portfolio && (
                                                <a href={user.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/40 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="Portfolio">
                                                    <Globe className="w-4 h-4" />
                                                </a>
                                            )}
                                            {user.socialLinks.twitter && (
                                                <a href={user.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary/40 hover:bg-primary/20 text-foreground hover:text-primary transition-colors" title="Twitter / X">
                                                    <Twitter className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Certificates & Activity */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl shadow-xl">
                            <CardHeader className="pb-3 border-b border-border/40">
                                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                                    <Award className="w-4 h-4 text-primary" />
                                    Certificates Earned
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                                {user.certificates && user.certificates.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {user.certificates.map((cert) => (
                                            <div key={cert._id} className="border border-border/50 rounded-xl p-4 flex flex-col gap-3 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                                                <div className="aspect-video relative bg-muted rounded-lg overflow-hidden border border-border/40">
                                                    <img
                                                        src={cert.course?.poster?.url || "/placeholder.svg"}
                                                        alt={cert.course?.title || "Certificate"}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-sm line-clamp-1 text-foreground">{cert.course?.title || "Course Certificate"}</h3>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Issued: {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "N/A"}</p>
                                                </div>
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/certificate/${cert.certificateId}/download`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                                                >
                                                    View Certificate
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-xs text-center py-6">No certificates earned yet.</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* User Posts */}
                        <div className="space-y-4">
                            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                Activity & Posts
                            </h2>
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <PostCard
                                        key={post._id}
                                        post={post}
                                        onDelete={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
                                    />
                                ))
                            ) : (
                                <Card className="bg-card/40 backdrop-blur-md border border-border/60 rounded-2xl">
                                    <CardContent className="p-6 text-center text-xs text-muted-foreground">
                                        No public posts yet.
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
