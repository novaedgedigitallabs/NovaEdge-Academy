"use client";

import { useState, useEffect } from "react";
import { getComments, addComment } from "@/services/comment";
import CommentItem from "./CommentItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export default function CommentSection({ postId }) {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await getComments(postId);
                if (res.success) {
                    setComments(res.comments);
                }
            } catch (error) {
                console.error("Failed to load comments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await addComment(newComment, postId);
            if (res.success) {
                setComments(prev => [...prev, res.comment]);
                setNewComment("");
                toast.success("Comment added");
            }
        } catch (error) {
            toast.error("Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    // Organize comments into tree (simple 1 level nesting for now based on parent field)
    const rootComments = comments.filter(c => !c.parent);
    const getReplies = (parentId) => comments.filter(c => c.parent === parentId);

    if (loading) return <div className="p-4 text-center"><Loader2 className="w-4 h-4 animate-spin mx-auto" /></div>;

    return (
        <div className="pt-2 border-t mt-2">
            {/* Comment List */}
            <div className="space-y-1 mb-4 max-h-[400px] overflow-y-auto pr-2">
                {rootComments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No comments yet.</p>
                ) : (
                    rootComments.map(comment => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            postId={postId}
                            replies={getReplies(comment._id)}
                            onDelete={(id) => setComments(prev => prev.filter(c => c._id !== id))}
                        />
                    ))
                )}
            </div>

            {/* Add Comment Input */}
            {user && (
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-1"
                    />
                    <Button type="submit" size="icon" disabled={!newComment.trim() || submitting}>
                        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </Button>
                </form>
            )}
        </div>
    );
}
