"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { getFriendRequests, getFriends, acceptFriendRequest, rejectFriendRequest, removeFriend } from "@/services/friend";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, UserCheck, UserMinus, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function NetworkPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [reqRes, friendRes] = await Promise.all([
                getFriendRequests(),
                getFriends()
            ]);
            if (reqRes.success) setRequests(reqRes.requests);
            if (friendRes.success) setFriends(friendRes.friends);
        } catch (error) {
            console.error("Failed to load network data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const handleAccept = async (requestId) => {
        try {
            await acceptFriendRequest(requestId);
            toast.success("Friend request accepted");
            fetchData();
        } catch (error) {
            toast.error("Failed to accept request");
        }
    };

    const handleReject = async (requestId) => {
        try {
            await rejectFriendRequest(requestId);
            toast.success("Friend request rejected");
            fetchData();
        } catch (error) {
            toast.error("Failed to reject request");
        }
    };

    const handleRemove = async (friendId) => {
        if (!confirm("Are you sure you want to remove this friend?")) return;
        try {
            await removeFriend(friendId);
            toast.success("Friend removed");
            fetchData();
        } catch (error) {
            toast.error("Failed to remove friend");
        }
    };

    if (authLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-6">
                <h1 className="text-2xl font-bold mb-6">My Network</h1>

                <Tabs defaultValue="friends" className="w-full">
                    <TabsList className="mb-6 w-full justify-start bg-transparent border-b rounded-none h-auto p-0">
                        <TabsTrigger
                            value="friends"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                        >
                            Friends ({friends.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="requests"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                        >
                            Requests ({requests.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="friends">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : friends.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                                <p className="mb-4">You haven't added any friends yet.</p>
                                <Button onClick={() => router.push("/search")}>Find People</Button>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {friends.map(friend => (
                                    <div key={friend._id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                                        <Link href={`/user/${friend._id}`}>
                                            <Avatar className="h-12 w-12 cursor-pointer">
                                                <AvatarImage src={friend.avatar?.url} />
                                                <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div className="flex-1 overflow-hidden">
                                            <Link href={`/user/${friend._id}`} className="font-semibold hover:underline truncate block">
                                                {friend.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground truncate">@{friend.username || "user"}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => router.push(`/messages?userId=${friend._id}`)} title="Message">
                                                <MessageCircle className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleRemove(friend._id)} title="Remove Friend">
                                                <UserMinus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="requests">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : requests.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                                <p>No pending friend requests.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-4">
                                {requests.map(req => (
                                    <div key={req._id} className="flex items-center gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                                        <Link href={`/user/${req.sender._id}`}>
                                            <Avatar className="h-12 w-12 cursor-pointer">
                                                <AvatarImage src={req.sender.avatar?.url} />
                                                <AvatarFallback>{req.sender.name[0]}</AvatarFallback>
                                            </Avatar>
                                        </Link>
                                        <div className="flex-1 overflow-hidden">
                                            <Link href={`/user/${req.sender._id}`} className="font-semibold hover:underline truncate block">
                                                {req.sender.name}
                                            </Link>
                                            <p className="text-xs text-muted-foreground truncate">@{req.sender.username || "user"}</p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Button size="sm" onClick={() => handleAccept(req._id)}>Accept</Button>
                                            <Button size="sm" variant="outline" onClick={() => handleReject(req._id)}>Reject</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
