"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { likePost, deletePost, createPost } from "@/services/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Trash2, MessageCircle, Repeat, Share2, BarChart2, MoreHorizontal } from "lucide-react";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PostCard({ post, onDelete }) {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(user && post.likes.includes(user._id));
    const [showComments, setShowComments] = useState(false);
    const [quoteContent, setQuoteContent] = useState("");
    const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user) return;

        const previousLikes = [...likes];
        const previousIsLiked = isLiked;

        if (isLiked) {
            setLikes(prev => prev.filter(id => id !== user._id));
            setIsLiked(false);
        } else {
            setLikes(prev => [...prev, user._id]);
            setIsLiked(true);
        }

        try {
            const res = await likePost(post._id);
            if (!res.success) {
                setLikes(previousLikes);
                setIsLiked(previousIsLiked);
            } else {
                setLikes(res.likes);
            }
        } catch (error) {
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await deletePost(post._id);
            if (res.success) {
                toast.success("Post deleted");
                if (onDelete) onDelete(post._id);
            }
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const handleRepost = async (e) => {
        e.stopPropagation();
        if (!confirm("Repost this?")) return;
        try {
            const res = await createPost("", post._id);
            if (res.success) {
                toast.success("Reposted!");
            }
        } catch (error) {
            toast.error("Failed to repost");
        }
    };

    const handleQuoteRepost = async () => {
        if (!quoteContent.trim()) return;
        try {
            const res = await createPost(quoteContent, post._id);
            if (res.success) {
                toast.success("Quote posted!");
                setQuoteDialogOpen(false);
                setQuoteContent("");
            }
        } catch (error) {
            toast.error("Failed to post quote");
        }
    };

    return (
        <article className="flex flex-col border-b border-border px-4 py-3 hover:bg-muted/5 transition-colors cursor-pointer">
            {/* Repost Indicator */}
            {post.repostOf && (
                <div className="mb-1 ml-8 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Repeat className="h-3 w-3" />
                    <span>{post.user.name} reposted</span>
                </div>
            )}

            <div className="flex gap-3">
                <Link href={`/user/${post.user._id}`} onClick={(e) => e.stopPropagation()}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={post.user.avatar?.url} />
                        <AvatarFallback>{post.user.name?.[0]}</AvatarFallback>
                    </Avatar>
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm truncate">
                            <Link href={`/user/${post.user._id}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
                                {post.user.name}
                            </Link>
                            <span className="text-muted-foreground truncate">@{post.user.username || post.user.email.split('@')[0]}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground hover:underline">
                                {formatDistanceToNow(new Date(post.createdAt))}
                            </span>
                        </div>
                        {user && (user._id === post.user._id || user.role === "admin") && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <div className="mt-1 text-sm whitespace-pre-wrap leading-normal">
                        {post.content.split(/(\s+)/).map((part, i) => {
                            if (part.startsWith('#') && part.length > 1) {
                                const tag = part.substring(1); // remove #
                                return (
                                    <Link
                                        key={i}
                                        href={`/hashtag/${tag.toLowerCase()}`}
                                        className="text-primary font-bold hover:underline"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            try {
                                                await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/hashtag/click`, {
                                                    method: "POST",
                                                    headers: { "Content-Type": "application/json" },
                                                    body: JSON.stringify({ tag }),
                                                    credentials: "include"
                                                });
                                            } catch (err) {
                                                console.error("Failed to track click", err);
                                            }
                                        }}
                                    >
                                        {part}
                                    </Link>
                                );
                            }
                            return part;
                        })}
                    </div>

                    {/* Reposted Content Display */}
                    {post.repostOf && (
                        <div className="mt-3 rounded-xl border border-border p-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-5 w-5">
                                    <AvatarImage src={post.repostOf.user?.avatar?.url} />
                                    <AvatarFallback>{post.repostOf.user?.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-sm">{post.repostOf.user?.name}</span>
                                <span className="text-muted-foreground text-sm">@{post.repostOf.user?.username}</span>
                                <span className="text-muted-foreground text-sm">· {formatDistanceToNow(new Date(post.repostOf.createdAt))}</span>
                            </div>
                            <p className="text-sm">{post.repostOf.content}</p>
                        </div>
                    )}

                    <div className="mt-3 flex items-center justify-between max-w-md text-muted-foreground">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="group h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
                        >
                            <MessageCircle className="h-4 w-4" />
                            {/* <span className="ml-2 text-xs group-hover:text-blue-500">24</span> */}
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="group h-8 w-8 hover:bg-green-500/10 hover:text-green-500">
                                    <Repeat className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={handleRepost}>
                                    <Repeat className="w-4 h-4 mr-2" /> Repost
                                </DropdownMenuItem>
                                <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <MessageCircle className="w-4 h-4 mr-2" /> Quote
                                        </DropdownMenuItem>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Quote Repost</DialogTitle>
                                        </DialogHeader>
                                        <Textarea
                                            value={quoteContent}
                                            onChange={(e) => setQuoteContent(e.target.value)}
                                            placeholder="Add a comment..."
                                        />
                                        <DialogFooter>
                                            <Button onClick={handleQuoteRepost}>Post</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "group h-8 w-8 hover:bg-pink-500/10 hover:text-pink-500",
                                isLiked && "text-pink-500"
                            )}
                            onClick={handleLike}
                        >
                            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                            {likes.length > 0 && <span className="ml-2 text-xs group-hover:text-pink-500">{likes.length}</span>}
                        </Button>

                        <Button variant="ghost" size="icon" className="group h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500">
                            <BarChart2 className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon" className="group h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {showComments && (
                <div className="mt-2 pl-12" onClick={(e) => e.stopPropagation()}>
                    <CommentSection postId={post._id} />
                </div>
            )}
        </article>
    );
}
