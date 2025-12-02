"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { likePost, deletePost, createPost } from "@/services/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Trash2, MessageCircle, Repeat, Share2, Copy } from "lucide-react";
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

    const handleLike = async () => {
        if (!user) return;

        // Optimistic update
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
                // Revert if failed
                setLikes(previousLikes);
                setIsLiked(previousIsLiked);
            } else {
                // Update with server source of truth if needed, but usually optimistic is fine
                setLikes(res.likes);
            }
        } catch (error) {
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
        }
    };

    const handleDelete = async () => {
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

    const handleRepost = async () => {
        if (!confirm("Repost this?")) return;
        try {
            const res = await createPost("", post._id);
            if (res.success) {
                toast.success("Reposted!");
                // Ideally refresh feed or add to top, but for now just notify
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

    const handleShare = () => {
        // Copy link to clipboard (assuming post page exists or just copy content)
        // For now copy content + author
        const text = `Check out this post by ${post.user.name}: "${post.content}"`;
        navigator.clipboard.writeText(text);
        toast.success("Post copied to clipboard");
    };

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                <Link href={`/user/${post.user._id}`}>
                    <Avatar>
                        <AvatarImage src={post.user.avatar?.url} />
                        <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex-1">
                    <Link href={`/user/${post.user._id}`} className="font-semibold hover:underline">
                        {post.user.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                </div>
                {user && (user._id === post.user._id || user.role === "admin") && (
                    <Button variant="ghost" size="icon" onClick={handleDelete} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <p className="whitespace-pre-wrap mb-2">{post.content}</p>

                {/* Reposted Content */}
                {post.repostOf && (
                    <div className="border rounded-lg p-3 mt-2 bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                                <AvatarImage src={post.repostOf.user?.avatar?.url} />
                                <AvatarFallback>{post.repostOf.user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold text-sm">{post.repostOf.user?.name}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(post.repostOf.createdAt), { addSuffix: true })}
                            </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{post.repostOf.content}</p>
                    </div>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn("gap-2", isLiked && "text-red-500 hover:text-red-600")}
                    onClick={handleLike}
                >
                    <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                    {likes.length} {likes.length === 1 ? "Like" : "Likes"}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle className="w-4 h-4" />
                    Comment
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Repeat className="w-4 h-4" />
                            Repost
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

                <Button variant="ghost" size="sm" className="gap-2" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                    Share
                </Button>
            </CardFooter>

            {showComments && <CommentSection postId={post._id} />}
        </Card>
    );
}
