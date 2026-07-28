"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { 
    getFriends, 
    getFriendRequests, 
    acceptFriendRequest, 
    rejectFriendRequest 
} from "@/services/friend";
import { getMessages, sendMessage } from "@/services/message";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, MessageSquare, Bot, ArrowLeft, UserCheck, UserX, UserPlus, Search, Image as ImageIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { toast } from "sonner";
import { compressImage } from "@/lib/image-compressor";

import { Suspense } from "react";

function MessagesContent() {
    const { user, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialUserId = searchParams?.get ? searchParams.get("userId") : null;

    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [isCompressing, setIsCompressing] = useState(false);
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [showAiSuggestion, setShowAiSuggestion] = useState(false);
    const [activeTab, setActiveTab] = useState("friends"); // "friends" | "requests"
    
    const messagesContainerRef = useRef(null);
    const fileInputRef = useRef(null);

    // Fetch friends list & pending friend requests
    const fetchFriendsData = async () => {
        if (!user) return;
        setLoadingFriends(true);
        setLoadingRequests(true);

        try {
            const [friendsRes, requestsRes] = await Promise.all([
                getFriends(),
                getFriendRequests()
            ]);

            if (friendsRes?.success) {
                setFriends(friendsRes.friends || []);
                if (initialUserId) {
                    const friend = (friendsRes.friends || []).find(f => f._id === initialUserId);
                    if (friend) setSelectedFriend(friend);
                }
            }

            if (requestsRes?.success) {
                setFriendRequests(requestsRes.requests || []);
            }
        } catch (err) {
            console.error("Failed to load contacts/requests", err);
        } finally {
            setLoadingFriends(false);
            setLoadingRequests(false);
        }
    };

    useEffect(() => {
        fetchFriendsData();
    }, [user, initialUserId]);

    // Fetch messages when friend selected
    useEffect(() => {
        if (selectedFriend) {
            setLoadingMessages(true);
            getMessages(selectedFriend._id)
                .then((res) => {
                    if (res.success) {
                        setMessages(res.messages);
                    }
                })
                .finally(() => setLoadingMessages(false));

            // Polling for new messages
            const interval = setInterval(() => {
                getMessages(selectedFriend._id).then(res => {
                    if (res.success) {
                        setMessages(prev => {
                            if (res.messages && res.messages.length !== prev.length) {
                                return res.messages;
                            }
                            return prev;
                        });
                    }
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [selectedFriend]);

    // Scroll inner container to bottom on new messages
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleAccept = async (requestId, senderUser) => {
        try {
            const res = await acceptFriendRequest(requestId);
            if (res.success) {
                toast.success(`Accepted friend request from ${senderUser.name}`);
                await fetchFriendsData();
                if (senderUser) setSelectedFriend(senderUser);
            }
        } catch (err) {
            toast.error(err.message || "Failed to accept request");
        }
    };

    const handleReject = async (requestId) => {
        try {
            const res = await rejectFriendRequest(requestId);
            if (res.success) {
                toast.success("Friend request declined");
                await fetchFriendsData();
            }
        } catch (err) {
            toast.error(err.message || "Failed to decline request");
        }
    };

    // Client-side image compress & select handler
    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        setIsCompressing(true);
        try {
            const compressedBase64 = await compressImage(file, 1000, 0.75);
            setSelectedImage(compressedBase64);
            toast.success("Image attached & optimized");
        } catch (err) {
            console.error("Compression error:", err);
            toast.error("Failed to process image");
        } finally {
            setIsCompressing(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedImage) || !selectedFriend || sending) return;

        const imageToSend = selectedImage;
        const textToSend = newMessage.trim();

        const tempMessage = {
            _id: Date.now(),
            sender: user._id,
            receiver: selectedFriend._id,
            message: textToSend,
            image: imageToSend ? { url: imageToSend } : undefined,
            createdAt: new Date(),
            temp: true
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage("");
        setSelectedImage(null);
        setShowAiSuggestion(false);
        setSending(true);

        try {
            const res = await sendMessage(selectedFriend._id, textToSend, imageToSend);
            if (res.success) {
                setMessages(prev => prev.map(m => m.temp && m._id === tempMessage._id ? res.message : m));
            }
        } catch (error) {
            console.error("Failed to send message", error);
            toast.error("Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setNewMessage(val);

        if (val.endsWith("@") || val.endsWith("@N") || val.endsWith("@No")) {
            setShowAiSuggestion(true);
        } else if (!val.includes("@")) {
            setShowAiSuggestion(false);
        }
    };

    const selectAi = () => {
        if (newMessage.endsWith("@")) {
            setNewMessage(prev => prev + "NovaEdge Academy ");
        } else {
            const parts = newMessage.split("@");
            parts.pop();
            setNewMessage(parts.join("@") + "@NovaEdge Academy ");
        }
        setShowAiSuggestion(false);
    };

    if (authLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;
    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <AppLayout
            showRightSidebar={false}
            hideMobileNav={!!selectedFriend}
            className={cn(
                "w-full pb-0 sm:pb-0",
                selectedFriend ? "h-[100dvh]" : "h-[calc(100dvh-65px)] sm:h-screen"
            )}
        >
            <div className="flex w-full h-full">

                {/* Left Sidebar Column - Friends & Requests */}
                <div className={cn(
                    "w-full md:w-80 shrink-0 flex flex-col border-r border-border h-full overflow-hidden bg-card/20",
                    selectedFriend ? "hidden md:flex" : "flex"
                )}>
                    {/* Header with Navigation Tabs */}
                    <div className="p-3 border-b border-border shrink-0 space-y-2">
                        <div className="flex items-center justify-between px-1">
                            <span className="font-bold text-lg text-foreground">Messages</span>
                            <MessageSquare className="w-5 h-5 text-primary" />
                        </div>

                        {/* Tabs: Friends vs Pending Requests */}
                        <div className="flex rounded-lg bg-secondary/50 p-1 gap-1 text-xs font-semibold">
                            <button
                                onClick={() => setActiveTab("friends")}
                                className={cn(
                                    "flex-1 py-1.5 rounded-md transition-all text-center",
                                    activeTab === "friends" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Friends ({friends.length})
                            </button>
                            <button
                                onClick={() => setActiveTab("requests")}
                                className={cn(
                                    "flex-1 py-1.5 rounded-md transition-all text-center flex items-center justify-center gap-1.5",
                                    activeTab === "requests" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                Requests
                                {friendRequests.length > 0 && (
                                    <span className="bg-primary text-primary-foreground text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                                        {friendRequests.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content List */}
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === "requests" ? (
                            /* Pending Requests Tab */
                            loadingRequests ? (
                                <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading requests...
                                </div>
                            ) : friendRequests.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-xs space-y-1">
                                    <UserCheck className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                                    <p className="font-semibold text-foreground">No pending requests</p>
                                    <p>Incoming friend requests will appear here.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/50">
                                    {friendRequests.map((req) => (
                                        <div key={req._id} className="p-3 space-y-2 hover:bg-muted/30 transition-colors">
                                            <div className="flex items-center gap-2.5">
                                                <Avatar className="h-9 w-9 border border-border">
                                                    <AvatarImage src={req.sender?.avatar?.url} />
                                                    <AvatarFallback>{req.sender?.name?.[0] || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div className="overflow-hidden flex-1">
                                                    <p className="font-bold text-sm truncate text-foreground">{req.sender?.name}</p>
                                                    <p className="text-xs text-muted-foreground truncate">@{req.sender?.username || "user"}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1 h-8 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                                                    onClick={() => handleAccept(req._id, req.sender)}
                                                >
                                                    <UserCheck className="w-3.5 h-3.5 mr-1" /> Accept
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 h-8 text-xs font-semibold rounded-lg border-border text-muted-foreground hover:text-foreground"
                                                    onClick={() => handleReject(req._id)}
                                                >
                                                    <UserX className="w-3.5 h-3.5 mr-1" /> Decline
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            /* Friends List Tab */
                            loadingFriends ? (
                                <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading friends...
                                </div>
                            ) : friends.length === 0 ? (
                                <div className="p-8 text-center text-muted-foreground text-xs space-y-2">
                                    <UserPlus className="w-8 h-8 mx-auto text-primary/40 mb-1" />
                                    <p className="font-semibold text-foreground text-sm">No friends added yet</p>
                                    <p>Search users or send friend requests from user profiles to start messaging.</p>
                                    <Button 
                                        size="sm" 
                                        variant="outline"
                                        className="mt-2 rounded-full text-xs"
                                        onClick={() => router.push("/search")}
                                    >
                                        <Search className="w-3.5 h-3.5 mr-1.5" /> Find People
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {friends.map(friend => (
                                        <button
                                            key={friend._id}
                                            onClick={() => setSelectedFriend(friend)}
                                            className={cn(
                                                "flex items-center gap-3 p-3.5 hover:bg-muted/50 transition-colors text-left border-b border-border/40",
                                                selectedFriend?._id === friend._id && "bg-muted/60 border-r-2 border-r-primary font-semibold"
                                            )}
                                        >
                                            <Avatar className="h-9 w-9 border border-border">
                                                <AvatarImage src={friend.avatar?.url} />
                                                <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="overflow-hidden flex-1">
                                                <p className="font-bold truncate text-sm text-foreground">{friend.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">@{friend.username || "user"}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Right Chat Area */}
                <div className={cn(
                    "flex-1 min-w-0 flex flex-col h-full bg-transparent overflow-hidden relative",
                    !selectedFriend ? "hidden md:flex" : "flex"
                )}>
                    {selectedFriend ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3 border-b border-border flex items-center justify-between bg-background/95 backdrop-blur sticky top-0 z-10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedFriend(null)}>
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                    <Avatar className="h-8 w-8 border border-border">
                                        <AvatarImage src={selectedFriend.avatar?.url} />
                                        <AvatarFallback>{selectedFriend.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 
                                            className="font-bold text-sm text-foreground hover:underline cursor-pointer"
                                            onClick={() => router.push(`/${selectedFriend.username || selectedFriend._id}`)}
                                        >
                                            {selectedFriend.name}
                                        </h2>
                                        <p className="text-xs text-muted-foreground">@{selectedFriend.username || "user"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages Thread */}
                            <div
                                ref={messagesContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4"
                            >
                                {loadingMessages ? (
                                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 py-12">
                                        <MessageSquare className="w-10 h-10 mb-2 text-primary/40" />
                                        <p className="font-semibold text-sm">No messages yet.</p>
                                        <p className="text-xs">Send a greeting or image to {selectedFriend.name}!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => {
                                        const isMe = msg.sender === user._id;
                                        const isAi = msg.isAi;
                                        const imgUrl = msg.image?.url || (typeof msg.image === "string" ? msg.image : null);

                                        return (
                                            <div key={i} className={cn("flex", isMe && !isAi ? "justify-end" : "justify-start")}>
                                                <div className={cn(
                                                    "max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-md transition-all",
                                                    isAi ? "bg-card/90 text-foreground border border-primary/30 backdrop-blur-sm" :
                                                        isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted text-foreground rounded-bl-none"
                                                )}>
                                                    {isAi && (
                                                        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-primary/15 font-bold text-xs text-primary">
                                                            <Bot className="w-4 h-4" /> NovaEdge AI
                                                        </div>
                                                    )}

                                                    {/* Image attachment rendering */}
                                                    {imgUrl && (
                                                        <div className="my-1 overflow-hidden rounded-xl border border-white/10 max-w-xs sm:max-w-sm">
                                                            <img
                                                                src={imgUrl}
                                                                alt="Chat attachment"
                                                                className="w-full h-auto max-h-72 object-cover rounded-xl transition-transform hover:scale-[1.02]"
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    )}

                                                    {isAi ? (
                                                        <MarkdownRenderer content={msg.message} />
                                                    ) : msg.message ? (
                                                        <div className="whitespace-pre-wrap break-words leading-relaxed">
                                                            {msg.message}
                                                        </div>
                                                    ) : null}

                                                    <p className={cn("text-[10px] mt-1.5 opacity-70 text-right font-medium", isMe && !isAi ? "text-primary-foreground" : "text-muted-foreground")}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Message Input Bar */}
                            <div className="p-3 border-t border-border bg-background shrink-0 relative">
                                {showAiSuggestion && (
                                    <div className="absolute bottom-full left-3 mb-2 bg-popover border border-border rounded-xl shadow-xl p-1.5 z-50 w-64 backdrop-blur-md">
                                        <button
                                            type="button"
                                            onClick={selectAi}
                                            className="flex items-center gap-2 px-3 py-2 hover:bg-muted/80 w-full text-left rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Bot className="w-4 h-4 text-primary" />
                                            <span>NovaEdge Academy</span>
                                        </button>
                                    </div>
                                )}

                                {/* Image Preview Box */}
                                {selectedImage && (
                                    <div className="mb-2 relative inline-block group">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-primary shadow-md bg-secondary">
                                            <img
                                                src={selectedImage}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedImage(null)}
                                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}

                                <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    {/* Attach Image Button */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        disabled={isCompressing || sending}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="rounded-full h-11 w-11 shrink-0 text-muted-foreground hover:text-foreground hover:bg-secondary/60 cursor-pointer"
                                        title="Attach optimized image"
                                    >
                                        {isCompressing ? (
                                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                        ) : (
                                            <ImageIcon className="w-5 h-5" />
                                        )}
                                    </Button>

                                    <Input
                                        value={newMessage}
                                        onChange={handleInputChange}
                                        placeholder={selectedImage ? "Add a caption..." : "Start a new message..."}
                                        className="flex-1 rounded-full bg-secondary/40 border-border focus-visible:ring-primary/20 px-4 min-h-[44px]"
                                    />

                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={(!newMessage.trim() && !selectedImage) || sending || isCompressing}
                                        className="rounded-full h-11 w-11 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
                                    >
                                        {sending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        /* Empty State Container */
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                            {friendRequests.length > 0 ? (
                                <div className="w-full max-w-sm text-center space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
                                        <UserCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-foreground">You have pending friend requests!</h2>
                                        <p className="text-xs text-muted-foreground mt-1">Review your requests on the left or accept them below to start chatting.</p>
                                    </div>

                                    <div className="space-y-2 text-left bg-muted/40 p-3 rounded-2xl border border-border max-h-60 overflow-y-auto">
                                        {friendRequests.map((req) => (
                                            <div key={req._id} className="flex items-center justify-between gap-2 p-2 bg-background rounded-xl border border-border">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <Avatar className="h-8 w-8 shrink-0">
                                                        <AvatarImage src={req.sender?.avatar?.url} />
                                                        <AvatarFallback>{req.sender?.name?.[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="overflow-hidden">
                                                        <p className="font-bold text-xs truncate text-foreground">{req.sender?.name}</p>
                                                        <p className="text-[10px] text-muted-foreground truncate">@{req.sender?.username || "user"}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <Button size="sm" className="h-7 text-xs px-2.5 bg-primary text-primary-foreground" onClick={() => handleAccept(req._id, req.sender)}>
                                                        Accept
                                                    </Button>
                                                    <Button size="sm" variant="ghost" className="h-7 text-xs px-2 text-muted-foreground" onClick={() => handleReject(req._id)}>
                                                        Decline
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full max-w-sm text-center space-y-3">
                                    <MessageSquare className="w-12 h-12 text-primary/40 mx-auto mb-1" />
                                    <h2 className="text-lg font-bold text-foreground">Select a conversation</h2>
                                    <p className="text-xs text-muted-foreground">Choose a friend from the left sidebar to start chatting, or search people to connect.</p>
                                    <Button 
                                        className="mt-4 rounded-full px-6 bg-primary text-primary-foreground font-semibold text-xs" 
                                        onClick={() => router.push("/search")}
                                    >
                                        <Search className="w-3.5 h-3.5 mr-1.5" /> Find People
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <MessagesContent />
        </Suspense>
    );
}
