"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from "@/services/friend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, UserPlus, Check, X, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NotificationsPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await getFriendRequests();
            if (res.success && Array.isArray(res.requests)) {
                setRequests(res.requests);
            }
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (reqId) => {
        setActionLoading((prev) => ({ ...prev, [reqId]: true }));
        try {
            const res = await acceptFriendRequest(reqId);
            if (res.success) {
                toast.success("Friend request accepted!");
                setRequests((prev) => prev.filter((r) => r._id !== reqId));
            } else {
                toast.error(res.message || "Failed to accept request");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setActionLoading((prev) => ({ ...prev, [reqId]: false }));
        }
    };

    const handleDecline = async (reqId) => {
        setActionLoading((prev) => ({ ...prev, [reqId]: true }));
        try {
            const res = await rejectFriendRequest(reqId);
            if (res.success) {
                toast.info("Friend request declined");
                setRequests((prev) => prev.filter((r) => r._id !== reqId));
            } else {
                toast.error(res.message || "Failed to decline request");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setActionLoading((prev) => ({ ...prev, [reqId]: false }));
        }
    };

    return (
        <AppLayout className="w-full border-r border-border p-0 min-h-screen">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            <Bell className="w-5 h-5 text-primary" /> Notifications & Activity
                        </h1>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-primary" /> Pending Friend Requests ({requests.length})
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="h-7 w-7 animate-spin text-primary" />
                    </div>
                ) : requests.length > 0 ? (
                    <div className="grid gap-3">
                        {requests.map((req) => {
                            const sender = req.sender || {};
                            return (
                                <div key={req._id} className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between gap-4 shadow-sm hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <Avatar className="h-11 w-11 border border-primary/20 shrink-0">
                                            <AvatarImage src={sender.avatar?.url} alt={sender.name} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {sender.name?.[0] || "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <Link href={`/${sender.username || sender._id}`} className="font-bold text-sm hover:underline truncate block">
                                                {sender.name || "User"}
                                            </Link>
                                            <p className="text-xs text-muted-foreground truncate">
                                                @{sender.username || "username"} · Sent you a friend request
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button
                                            size="sm"
                                            onClick={() => handleAccept(req._id)}
                                            disabled={actionLoading[req._id]}
                                            className="rounded-full h-8 px-3 text-xs bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-bold"
                                        >
                                            {actionLoading[req._id] ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                                            Accept
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDecline(req._id)}
                                            disabled={actionLoading[req._id]}
                                            className="rounded-full h-8 px-3 text-xs gap-1.5 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Decline
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 space-y-3 bg-secondary/10 border border-dashed border-border rounded-2xl">
                        <Bell className="w-10 h-10 text-muted-foreground/50 mx-auto" />
                        <p className="text-sm font-semibold text-foreground">No new notifications right now</p>
                        <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                            When people send you friend requests or interact with your posts, you will see them here.
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
