"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { getFriendRequests, getFriends, acceptFriendRequest, rejectFriendRequest, removeFriend } from "@/services/friend";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
                <h1 className="text-3xl font-bold mb-8">My Network</h1>

                <Tabs defaultValue="friends" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="friends">Friends ({friends.length})</TabsTrigger>
                        <TabsTrigger value="requests">Requests ({requests.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="friends">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : friends.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                    <p className="mb-4">You haven't added any friends yet.</p>
                                    <Button onClick={() => router.push("/search")}>Find People</Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {friends.map(friend => (
                                    <Card key={friend._id}>
                                        <CardContent className="p-4 flex items-center gap-4">
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
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="requests">
                        {loading ? (
                            <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
                        ) : requests.length === 0 ? (
                            <Card>
                                <CardContent className="py-12 text-center text-muted-foreground">
                                    <p>No pending friend requests.</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {requests.map(req => (
                                    <Card key={req._id}>
                                        <CardContent className="p-4 flex items-center gap-4">
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
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>
            <Footer />
        </div>
    );
}
