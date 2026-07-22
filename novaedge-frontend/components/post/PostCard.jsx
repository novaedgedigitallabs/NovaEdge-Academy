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
import { Heart, Trash2, Pencil, MessageCircle, Repeat, Share2, BarChart2, MoreHorizontal, MapPin, Calendar } from "lucide-react";
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
    const authorProfileLink = authorUsername ? `/${authorUsername}` : (authorId ? `/${authorId}` : "/profile");

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
    const targetPost = post.repostOf || post;

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
            if (res.success) {
                setLikes(res.likes || []);
                setIsLiked(res.likes?.includes(user._id));
            } else {
                setLikes(previousLikes);
                setIsLiked(previousIsLiked);
            }
        } catch (error) {
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!user || !targetPostId) return;

        try {
            const res = await deletePost(targetPostId);
            if (res.success) {
                toast.success("Post deleted successfully");
                if (onDelete) onDelete(targetPostId);
            } else {
                toast.error(res.message || "Failed to delete post");
            }
        } catch (error) {
            toast.error("Failed to delete post");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user || !targetPostId || !editContent.trim()) return;

        setIsUpdating(true);
        try {
            const res = await updatePost(targetPostId, { content: editContent.trim() });
            if (res.success) {
                toast.success("Post updated successfully");
                setPostContent(res.post.content);
                setIsEdited(true);
                setEditDialogOpen(false);
                if (onUpdate) onUpdate(res.post);
            } else {
                toast.error(res.message || "Failed to update post");
            }
        } catch (error) {
            toast.error("Failed to update post");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRepost = async (e) => {
        e.stopPropagation();
        if (!user || !targetPostId) return;

        try {
            const res = await createPost({ repostOf: targetPostId });
            if (res.success) {
                toast.success("Post reposted to your feed");
            } else {
                toast.error(res.message || "Failed to repost");
            }
        } catch (error) {
            toast.error("Failed to repost");
        }
    };

    const handleQuoteSubmit = async () => {
        if (!quoteContent.trim()) return;
        try {
            const res = await createPost({
                content: quoteContent,
                repostOf: targetPostId
            });
            if (res.success) {
                toast.success("Quote post created");
                setQuoteDialogOpen(false);
                setQuoteContent("");
            } else {
                toast.error(res.message || "Failed to post quote");
            }
        } catch (error) {
            toast.error("Failed to post quote");
        }
    };

    const handleShare = async (e) => {
        e.stopPropagation();
        const postUrl = `${window.location.origin}/post/${targetPostId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Post by ${authorName}`,
                    text: postContent,
                    url: postUrl,
                });
                return;
            } catch (err) {
                // Share cancelled
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
                <Link href={authorProfileLink} onClick={(e) => e.stopPropagation()}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={authorAvatar} />
                        <AvatarFallback>{authorName[0]}</AvatarFallback>
                    </Avatar>
                </Link>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-sm truncate">
                            <Link href={authorProfileLink} className="font-bold hover:underline" onClick={(e) => e.stopPropagation()}>
                                {authorName}
                            </Link>
                            <span className="text-muted-foreground truncate">@{authorUsername}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground hover:underline text-xs">
                                {formatDistanceToNow(new Date(post.createdAt || Date.now()), { addSuffix: true })}
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
                                        <Pencil className="mr-2 h-4 w-4" /> Edit Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> Delete Post
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Post Text */}
                    <div className="mt-1 text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                        {postContent}
                    </div>

                    {/* Media Attachments */}
                    {post.images && post.images.length > 0 && (
                        <div className={cn(
                            "mt-3 grid gap-2 rounded-2xl overflow-hidden border border-border",
                            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                        )}>
                            {post.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={typeof img === 'string' ? img : img.url}
                                    alt="Post media"
                                    className="w-full h-auto object-cover max-h-[350px]"
                                />
                            ))}
                        </div>
                    )}

                    {/* Post Actions */}
                    <div className="mt-3 flex items-center justify-between text-muted-foreground max-w-md text-xs">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors group"
                        >
                            <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span>{post.commentsCount || 0}</span>
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-1.5 hover:text-green-500 transition-colors group"
                                >
                                    <Repeat className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                    <span>{post.repostsCount || 0}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onClick={handleRepost}>Repost</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setQuoteDialogOpen(true)}>Quote Post</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 transition-colors group",
                                isLiked ? "text-pink-600 font-bold" : "hover:text-pink-600"
                            )}
                        >
                            <Heart className={cn("h-4 w-4 group-hover:scale-110 transition-transform", isLiked && "fill-current")} />
                            <span>{likes.length}</span>
                        </button>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-1.5 hover:text-primary transition-colors group"
                        >
                            <Share2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comment Section Drawer */}
            {showComments && (
                <div className="mt-3 pt-3 border-t border-border/40" onClick={(e) => e.stopPropagation()}>
                    <CommentSection postId={targetPostId} />
                </div>
            )}

            {/* Edit Post Modal */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Edit Post</DialogTitle>
                        <DialogDescription>Modify your published post content.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="What's on your mind?"
                            className="min-h-[120px] bg-secondary/20"
                        />
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isUpdating || !editContent.trim()}>
                                {isUpdating ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Quote Post Modal */}
            <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                <DialogContent className="sm:max-w-md bg-card border-border" onClick={(e) => e.stopPropagation()}>
                    <DialogHeader>
                        <DialogTitle>Quote Post</DialogTitle>
                        <DialogDescription>Add your thoughts to this post.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Textarea
                            value={quoteContent}
                            onChange={(e) => setQuoteContent(e.target.value)}
                            placeholder="Add a comment..."
                            className="min-h-[100px] bg-secondary/20"
                        />
                        <div className="p-3 border border-border rounded-xl bg-secondary/10 text-xs">
                            <span className="font-bold">{authorName}</span>
                            <p className="text-muted-foreground line-clamp-2 mt-1">{postContent}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setQuoteDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleQuoteSubmit} disabled={!quoteContent.trim()}>Post Quote</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </article>
    );
}
