"use client";

import { useState } from "react";
import { addComment, toggleUpvote } from "@/services/discussion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowBigUp, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export default function DiscussionThread({ discussion, comments, onRefresh }) {
    const { user } = useAuth();
    const [replyContent, setReplyContent] = useState("");
    const [showReply, setShowReply] = useState(false);

    const handleUpvote = async (type, id) => {
        try {
            await toggleUpvote(type, id);
            onRefresh(); // Refresh to show new count
        } catch (e) {
            toast.error("Failed to upvote");
        }
    };

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        try {
            await addComment(discussion._id, { content: replyContent });
            setReplyContent("");
            setShowReply(false);
            onRefresh();
            toast.success("Reply added");
        } catch (e) {
            toast.error("Failed to reply");
        }
    };

    return (
        <div className="border rounded-lg p-4 space-y-4 bg-card">
            {/* Main Post */}
            <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleUpvote("discussion", discussion._id)}>
                        <ArrowBigUp className={`w-6 h-6 ${discussion.upvotes.includes(user?._id) ? "text-orange-500 fill-orange-500" : ""}`} />
                    </Button>
                    <span className="text-sm font-bold">{discussion.upvotes.length}</span>
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg">{discussion.title}</h3>
                    <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={discussion.user.avatar?.url} />
                            <AvatarFallback>{discussion.user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{discussion.user.name}</span>
                        <span>•</span>
                        <span>{new Date(discussion.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{discussion.content}</p>

                    <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setShowReply(!showReply)}>
                            <MessageSquare className="w-4 h-4 mr-2" /> Reply
                        </Button>
                    </div>
                </div>
            </div>

            {/* Reply Box */}
            {showReply && (
                <div className="pl-12 space-y-2">
                    <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <Button size="sm" onClick={handleReply}>Post Reply</Button>
                </div>
            )}

            {/* Comments */}
            <div className="pl-12 space-y-4 mt-4">
                {comments.map((comment) => (
                    <div key={comment._id} className="border-l-2 pl-4 py-2">
                        <div className="flex gap-2 text-xs text-muted-foreground mb-1">
                            <span className="font-bold text-foreground">{comment.user.name}</span>
                            <span>•</span>
                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={() => handleUpvote("comment", comment._id)}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-orange-500"
                            >
                                <ArrowBigUp className={`w-4 h-4 ${comment.upvotes.includes(user?._id) ? "text-orange-500 fill-orange-500" : ""}`} />
                                {comment.upvotes.length}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
