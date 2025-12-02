"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { likeComment, deleteComment, addComment } from "@/services/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, Trash2, MessageCircle, Copy, CornerDownRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CommentItem({ comment, postId, onDelete, replies = [] }) {
    const { user } = useAuth();
    const [likes, setLikes] = useState(comment.likes || []);
    const [isLiked, setIsLiked] = useState(user && comment.likes.includes(user._id));
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [replyContent, setReplyContent] = useState("");
    const [localReplies, setLocalReplies] = useState(replies);

    const handleLike = async () => {
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
            const res = await likeComment(comment._id);
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

    const handleDelete = async () => {
        if (!confirm("Delete this comment?")) return;
        try {
            const res = await deleteComment(comment._id);
            if (res.success) {
                toast.success("Comment deleted");
                if (onDelete) onDelete(comment._id);
            }
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(comment.content);
        toast.success("Comment copied to clipboard");
    };

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            const res = await addComment(replyContent, postId, comment._id);
            if (res.success) {
                setLocalReplies(prev => [...prev, res.comment]);
                setReplyContent("");
                setShowReplyInput(false);
                toast.success("Reply added");
            }
        } catch (error) {
            toast.error("Failed to add reply");
        }
    };

    return (
        <div className="flex gap-3 py-3">
            <Link href={`/user/${comment.user._id}`}>
                <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user.avatar?.url} />
                    <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-1">
                        <Link href={`/user/${comment.user._id}`} className="font-semibold text-sm hover:underline">
                            {comment.user.name}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                </div>

                <div className="flex items-center gap-4 mt-1 ml-1">
                    <button
                        onClick={handleLike}
                        className={cn("text-xs font-medium flex items-center gap-1 hover:text-red-500 transition-colors", isLiked && "text-red-500")}
                    >
                        <Heart className={cn("w-3 h-3", isLiked && "fill-current")} />
                        {likes.length > 0 && likes.length} Like
                    </button>
                    <button
                        onClick={() => setShowReplyInput(!showReplyInput)}
                        className="text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        Reply
                    </button>
                    <button
                        onClick={handleCopy}
                        className="text-xs font-medium flex items-center gap-1 hover:text-primary transition-colors"
                    >
                        Copy
                    </button>
                    {user && (user._id === comment.user._id || user.role === "admin") && (
                        <button
                            onClick={handleDelete}
                            className="text-xs font-medium flex items-center gap-1 hover:text-destructive transition-colors"
                        >
                            Delete
                        </button>
                    )}
                </div>

                {/* Reply Input */}
                {showReplyInput && (
                    <form onSubmit={handleReply} className="mt-3 flex gap-2">
                        <Input
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="h-8 text-sm"
                            autoFocus
                        />
                        <Button type="submit" size="sm" className="h-8" disabled={!replyContent.trim()}>
                            Reply
                        </Button>
                    </form>
                )}

                {/* Nested Replies */}
                {localReplies.length > 0 && (
                    <div className="mt-2 pl-4 border-l-2 border-muted">
                        {localReplies.map(reply => (
                            <CommentItem
                                key={reply._id}
                                comment={reply}
                                postId={postId}
                                onDelete={(id) => setLocalReplies(prev => prev.filter(r => r._id !== id))}
                            // Deep nesting usually limited, but we can recurse if needed. 
                            // For now, let's assume 1 level deep for simplicity or pass empty replies
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
