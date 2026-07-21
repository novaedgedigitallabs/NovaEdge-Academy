"use client";

import { useState, useEffect } from "react";
import { getTicket, addComment, updateTicket } from "@/services/tickets";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Loader2, Send, User } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export default function TicketDetail({ ticketId }) {
    const { user } = useAuth();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState("");

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    const fetchTicketDetails = async () => {
        setLoading(true);
        try {
            const res = await getTicket(ticketId);
            setTicket(res.data);
            setComments(res.comments);
            setStatus(res.data.status);
        } catch (error) {
            toast.error("Failed to load ticket details");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            await updateTicket(ticketId, { status: newStatus });
            setStatus(newStatus);
            toast.success(`Ticket status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await addComment(ticketId, { content: newComment });
            setComments([...comments, { ...res.data, author: user }]); // Optimistic update
            setNewComment("");
            toast.success("Comment added");
        } catch (error) {
            toast.error("Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!ticket) return <div>Ticket not found</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
                {/* Ticket Header */}
                <div className="bg-card border rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-2">{ticket.subject}</h1>
                    <p className="text-muted-foreground mb-4">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {ticket.requester?.name || ticket.requesterName || "Guest"}
                        </div>
                        <span>•</span>
                        <span>{format(new Date(ticket.createdAt), "PPp")}</span>
                    </div>
                </div>

                {/* Conversation */}
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className={`flex gap-4 ${comment.author?._id === user?._id ? "flex-row-reverse" : ""
                                }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-4 ${comment.author?._id === user?._id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-4 mb-2">
                                    <span className="font-semibold text-sm">
                                        {comment.author?.name || "Unknown"}
                                    </span>
                                    <span className="text-xs opacity-70">
                                        {format(new Date(comment.createdAt), "p")}
                                    </span>
                                </div>
                                <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Box */}
                <form onSubmit={handleSubmitComment} className="space-y-4">
                    <Textarea
                        placeholder="Type your reply..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={submitting || !newComment.trim()}>
                            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Send className="mr-2 h-4 w-4" />
                            Send Reply
                        </Button>
                    </div>
                </form>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                <div className="bg-card border rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold">Ticket Properties</h3>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Priority</label>
                        <div className="flex items-center">
                            <Badge variant="outline" className="capitalize">
                                {ticket.priority}
                            </Badge>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Assignee</label>
                        <div className="text-sm">
                            {ticket.assignee?.name || "Unassigned"}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Queue</label>
                        <div className="text-sm">
                            {ticket.queue?.name || "None"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
