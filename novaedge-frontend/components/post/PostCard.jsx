"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { likePost, deletePost, createPost, updatePost } from "@/services/post";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Trash2, Pencil, MessageCircle, Repeat, Share2, BarChart2, MoreHorizontal } from "lucide-react";
import CommentSection from "./CommentSection";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function PostCard({ post, onDelete, onUpdate }) {
    const { user } = useAuth();

    if (!post) return null;
    const author = post.user || {};
    const authorName = author.name || "Anonymous";
    const authorUsername = author.username || (author.email ? author.email.split('@')[0] : null) || (author.name ? author.name.toLowerCase().replace(/\s+/g, '') : "user");
    const authorId = author._id || "";
    const authorAvatar = author.avatar?.url;

    const [likes, setLikes] = useState(post.likes || []);
    const [isLiked, setIsLiked] = useState(user && post.likes?.includes(user._id));
    const [showComments, setShowComments] = useState(false);
    const [quoteContent, setQuoteContent] = useState("");
    const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [postContent, setPostContent] = useState(post.content || "");
    const [editContent, setEditContent] = useState(post.content || "");
    const [isEdited, setIsEdited] = useState(post.isEdited || false);
    const [isUpdating, setIsUpdating] = useState(false);

    const targetPostId = post._id || post.id;

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!user || !targetPostId) return;

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
            const res = await likePost(targetPostId);
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

    const handleEditSave = async () => {
        if (!editContent.trim()) {
            toast.error("Post content cannot be empty");
            return;
        }
        if (!targetPostId) {
            toast.error("Invalid post ID");
            return;
        }
        setIsUpdating(true);
        try {
            const res = await updatePost(targetPostId, editContent);
            if (res.success) {
                toast.success("Post updated successfully!");
                setPostContent(editContent);
                setIsEdited(true);
                setEditDialogOpen(false);
                if (onUpdate) onUpdate(res.post || { ...post, content: editContent, isEdited: true });
            } else {
                toast.error(res.message || "Failed to update post");
            }
        } catch (error) {
            console.error("Update post error:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to update post");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!targetPostId) return;
        if (!confirm("Are you sure you want to delete this post?")) return;
        try {
            const res = await deletePost(targetPostId);
            if (res.success) {
                toast.success("Post deleted");
                if (onDelete) onDelete(targetPostId);
            }
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const handleRepost = async (e) => {
        if (e) e.stopPropagation();
        if (!targetPostId) return;
        if (!confirm("Repost this?")) return;
        try {
            const res = await createPost("", targetPostId);
            if (res.success) {
                toast.success("Reposted!");
            }
        } catch (error) {
            toast.error("Failed to repost");
        }
    };

    const handleQuoteRepost = async () => {
        if (!quoteContent.trim() || !targetPostId) return;
        try {
            const res = await createPost(quoteContent, targetPostId);
            if (res.success) {
                toast.success("Quote posted!");
                setQuoteDialogOpen(false);
                setQuoteContent("");
            }
        } catch (error) {
            toast.error("Failed to post quote");
        }
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const postUrl = typeof window !== "undefined" ? `${window.location.origin}/post/${targetPostId}` : "";

        if (typeof navigator !== "undefined" && navigator.share) {
            try {
                await navigator.share({
                    title: `Post by ${authorName}`,
                    text: postContent,
                    url: postUrl,
                });
                toast.success("Shared successfully!");
                return;
            } catch (err) {
                if (err.name === "AbortError") return;
            }
        }

        if (typeof navigator !== "undefined" && navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(postUrl);
                toast.success("Post link copied to clipboard!");
            } catch (err) {
                toast.error("Failed to copy link");
            }
        }
    };

    return (
        <article className="flex flex-col border-b border-border px-4 py-3 hover:bg-muted/5 transition-colors cursor-pointer">
            {/* Repost Indicator */}
            {post.repostOf && (
                <div className="mb-1 ml-8 flex items-center gap-2 text-xs font-bold text-muted-foreground">
                    <Repeat className="h-3 w-3" />
                    <span>{authorName} reposted</span>
                </div>
            )}

            <div className="flex gap-3">
                <Link href={`/user/${authorId}`} onClick={(e) => e.stopPropagation()}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={authorAvatar} />
                        <AvatarFallback>{authorName[0]}</AvatarFallback>
                    </Avatar>
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm truncate">
                            <Link href={`/user/${authorId}`} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
                                {authorName}
                            </Link>
                            <span className="text-muted-foreground truncate">@{authorUsername}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground hover:underline">
                                {formatDistanceToNow(new Date(post.createdAt || Date.now()))}
                            </span>
                            {(isEdited || post.isEdited) && (
                                <span className="text-xs text-muted-foreground/80 font-normal italic">· Edited</span>
                            )}
                        </div>
                        {user && authorId && (user._id === authorId || user.role === "admin") && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-primary/10 hover:text-primary">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditDialogOpen(true); }}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    <div className="mt-1 text-sm whitespace-pre-wrap leading-normal">
                        {(postContent || "").split(/(\s+)/).map((part, i) => {
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
                                    <AvatarFallback>{post.repostOf.user?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="font-bold text-sm">{post.repostOf.user?.name || "User"}</span>
                                <span className="text-muted-foreground text-sm">@{post.repostOf.user?.username || (post.repostOf.user?.email ? post.repostOf.user.email.split('@')[0] : "user")}</span>
                                <span className="text-muted-foreground text-sm">· {formatDistanceToNow(new Date(post.repostOf.createdAt || Date.now()))}</span>
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
                                <DropdownMenuItem onClick={() => setQuoteDialogOpen(true)}>
                                    <MessageCircle className="w-4 h-4 mr-2" /> Quote
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Separate Quote Repost Modal */}
                        <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                            <DialogContent onClick={(e) => e.stopPropagation()}>
                                <DialogHeader>
                                    <DialogTitle>Quote Repost</DialogTitle>
                                    <DialogDescription className="sr-only">Add a quote comment to this repost</DialogDescription>
                                </DialogHeader>
                                <Textarea
                                    value={quoteContent}
                                    onChange={(e) => setQuoteContent(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="min-h-[100px] bg-secondary/30 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                                />
                                <DialogFooter>
                                    <Button onClick={handleQuoteRepost}>Post</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

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

                        <Button
                            variant="ghost"
                            size="icon"
                            className="group h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500"
                            onClick={handleShare}
                            title="Share post"
                        >
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

            {/* Edit Post Modal */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription className="sr-only">Edit your post content</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="Edit your post content..."
                        className="min-h-[120px] bg-secondary/30 text-sm focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleEditSave} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </article>
    );
}
