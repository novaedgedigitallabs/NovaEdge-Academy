"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, UserCheck, UserMinus, MessageCircle, Loader2 } from "lucide-react";
import {
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendStatus,
    removeFriend
} from "@/services/friend";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function FriendActionButton({ otherUserId, onStatusChange }) {
    const [status, setStatus] = useState("loading"); // loading, none, sent, received, friends
    const [requestId, setRequestId] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const fetchStatus = async () => {
        try {
            const res = await getFriendStatus(otherUserId);
            if (res.success) {
                setStatus(res.status);
                setRequestId(res.requestId);
                if (onStatusChange) onStatusChange(res.status);
            }
        } catch (error) {
            console.error("Failed to fetch friend status", error);
            setStatus("none");
        }
    };

    useEffect(() => {
        if (otherUserId) {
            fetchStatus();
        }
    }, [otherUserId]);

    const handleSendRequest = async () => {
        setLoading(true);
        try {
            await sendFriendRequest(otherUserId);
            toast.success("Friend request sent");
            await fetchStatus();
        } catch (error) {
            toast.error(error.message || "Failed to send request");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        setLoading(true);
        try {
            await acceptFriendRequest(requestId);
            toast.success("Friend request accepted");
            await fetchStatus();
        } catch (error) {
            toast.error(error.message || "Failed to accept request");
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async () => {
        setLoading(true);
        try {
            await rejectFriendRequest(requestId);
            toast.success("Friend request rejected");
            await fetchStatus();
        } catch (error) {
            toast.error(error.message || "Failed to reject request");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFriend = async () => {
        if (!confirm("Are you sure you want to remove this friend?")) return;
        setLoading(true);
        try {
            await removeFriend(otherUserId);
            toast.success("Friend removed");
            await fetchStatus();
        } catch (error) {
            toast.error(error.message || "Failed to remove friend");
        } finally {
            setLoading(false);
        }
    };

    if (status === "loading") return <Button disabled size="sm" variant="outline"><Loader2 className="w-4 h-4 animate-spin" /></Button>;

    if (status === "friends") {
        return (
            <div className="flex gap-2">
                <Button size="sm" onClick={() => router.push(`/messages?userId=${otherUserId}`)}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                </Button>
                <Button size="sm" variant="outline" onClick={handleRemoveFriend} disabled={loading}>
                    <UserMinus className="w-4 h-4 mr-2" />
                    Unfriend
                </Button>
            </div>
        );
    }

    if (status === "sent") {
        return (
            <Button size="sm" variant="secondary" disabled>
                <UserCheck className="w-4 h-4 mr-2" />
                Request Sent
            </Button>
        );
    }

    if (status === "received") {
        return (
            <div className="flex gap-2">
                <Button size="sm" onClick={handleAcceptRequest} disabled={loading}>
                    Accept
                </Button>
                <Button size="sm" variant="outline" onClick={handleRejectRequest} disabled={loading}>
                    Reject
                </Button>
            </div>
        );
    }

    return (
        <Button size="sm" onClick={handleSendRequest} disabled={loading}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
        </Button>
    );
}
