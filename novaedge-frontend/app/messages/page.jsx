"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getFriends } from "@/services/friend";
import { getMessages, sendMessage } from "@/services/message";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageSquare, Bot, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessagesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialUserId = searchParams.get("userId");

    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [showAiSuggestion, setShowAiSuggestion] = useState(false);
    const scrollRef = useRef(null);

    // Fetch friends list
    useEffect(() => {
        if (user) {
            getFriends()
                .then((res) => {
                    if (res.success) {
                        setFriends(res.friends);
                        // If userId param exists, select that friend
                        if (initialUserId) {
                            const friend = res.friends.find(f => f._id === initialUserId);
                            if (friend) setSelectedFriend(friend);
                        }
                    }
                })
                .finally(() => setLoadingFriends(false));
        }
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

            // Optional: Set up polling for new messages
            const interval = setInterval(() => {
                getMessages(selectedFriend._id).then(res => {
                    if (res.success) setMessages(res.messages);
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [selectedFriend]);

    // Scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFriend) return;

        const tempMessage = {
            _id: Date.now(),
            sender: user._id,
            receiver: selectedFriend._id,
            message: newMessage,
            createdAt: new Date(),
            temp: true
        };

        setMessages(prev => [...prev, tempMessage]);
        setNewMessage("");
        setShowAiSuggestion(false);

        try {
            const res = await sendMessage(selectedFriend._id, tempMessage.message);
            if (res.success) {
                // Replace temp message with real one or just refresh
                setMessages(prev => prev.map(m => m.temp && m._id === tempMessage._id ? res.message : m));
            }
        } catch (error) {
            console.error("Failed to send message", error);
            // Maybe show error state on message
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setNewMessage(val);

        // Simple check: if ends with "@" or "@N" etc
        if (val.endsWith("@") || val.endsWith("@N") || val.endsWith("@No")) {
            setShowAiSuggestion(true);
        } else if (!val.includes("@")) {
            setShowAiSuggestion(false);
        }
    };

    const selectAi = () => {
        // Replace the last occurrence of @... with @NovaEdge Academy
        if (newMessage.endsWith("@")) {
            setNewMessage(prev => prev + "NovaEdge Academy ");
        } else {
            // Replace word starting with @
            const parts = newMessage.split("@");
            parts.pop();
            setNewMessage(parts.join("@") + "@NovaEdge Academy ");
        }
        setShowAiSuggestion(false);
    };

    if (authLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <AppLayout
            showRightSidebar={false}
            hideMobileNav={!!selectedFriend}
            className={cn(
                "max-w-5xl border-r border-border pb-0 sm:pb-0",
                selectedFriend ? "h-[100dvh]" : "h-[calc(100dvh-65px)] sm:h-screen"
            )}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">

                {/* Friends List - Hidden on mobile if chat selected */}
                <div className={cn(
                    "flex flex-col border-r border-border h-full",
                    selectedFriend ? "hidden md:flex" : "flex"
                )}>
                    <div className="p-4 border-b font-bold text-xl flex items-center justify-between">
                        <span>Messages</span>
                        <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loadingFriends ? (
                            <div className="p-4 text-center text-muted-foreground">Loading...</div>
                        ) : friends.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                No friends yet.
                            </div>
                        ) : (
                            <div className="flex flex-col">
                                {friends.map(friend => (
                                    <button
                                        key={friend._id}
                                        onClick={() => setSelectedFriend(friend)}
                                        className={cn(
                                            "flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border/50",
                                            selectedFriend?._id === friend._id && "bg-muted/50 border-r-2 border-r-primary"
                                        )}
                                    >
                                        <Avatar>
                                            <AvatarImage src={friend.avatar?.url} />
                                            <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="overflow-hidden">
                                            <p className="font-bold truncate text-sm">{friend.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">@{friend.username || "user"}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area - Full width on mobile if selected */}
                <div className={cn(
                    "md:col-span-2 flex flex-col h-full bg-background overflow-hidden",
                    !selectedFriend ? "hidden md:flex" : "flex"
                )}>
                    {selectedFriend ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-3 border-b flex items-center gap-3 bg-background/95 backdrop-blur sticky top-0 z-10">
                                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedFriend(null)}>
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={selectedFriend.avatar?.url} />
                                    <AvatarFallback>{selectedFriend.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-bold text-sm">{selectedFriend.name}</h2>
                                    <p className="text-xs text-muted-foreground">@{selectedFriend.username || "user"}</p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4" id="messages-container">
                                {loadingMessages ? (
                                    <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                                        <p>No messages yet.</p>
                                        <p className="text-sm">Say hello!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4 pb-4">
                                        {messages.map((msg, i) => {
                                            const isMe = msg.sender === user._id;
                                            const isAi = msg.isAi;

                                            return (
                                                <div key={i} className={cn("flex", isMe && !isAi ? "justify-end" : "justify-start")}>
                                                    <div className={cn(
                                                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                                                        isAi ? "bg-secondary text-secondary-foreground border border-primary/20" :
                                                            isMe ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
                                                    )}>
                                                        {isAi && (
                                                            <div className="flex items-center gap-2 mb-1 font-bold text-xs text-primary">
                                                                <Bot className="w-3 h-3" /> NovaEdge AI
                                                            </div>
                                                        )}
                                                        <div className="prose dark:prose-invert text-sm max-w-none break-words">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                {msg.message.replace("**NovaEdge AI:**", "").trim()}
                                                            </ReactMarkdown>
                                                        </div>
                                                        <p className={cn("text-[10px] mt-1 opacity-70 text-right", isMe && !isAi ? "text-primary-foreground" : "text-muted-foreground")}>
                                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={scrollRef} />
                                    </div>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-3 border-t bg-background">
                                <form onSubmit={handleSendMessage} className="flex gap-2 relative items-end">
                                    {showAiSuggestion && (
                                        <div className="absolute bottom-full left-0 mb-2 bg-popover border rounded shadow-lg p-1 z-50 w-64">
                                            <button
                                                type="button"
                                                onClick={selectAi}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-muted w-full text-left rounded text-sm"
                                            >
                                                <Bot className="w-4 h-4 text-primary" />
                                                <span>NovaEdge Academy</span>
                                            </button>
                                        </div>
                                    )}
                                    <Input
                                        value={newMessage}
                                        onChange={handleInputChange}
                                        placeholder="Start a new message"
                                        className="flex-1 rounded-xl bg-secondary/50 border-none min-h-[44px]"
                                    />
                                    <Button type="submit" size="icon" disabled={!newMessage.trim()} className="rounded-full h-11 w-11">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                            <div className="w-full max-w-sm text-center">
                                <h2 className="text-2xl font-bold mb-2 text-foreground">Select a message</h2>
                                <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                                <Button className="mt-6 rounded-full px-8" onClick={() => router.push("/search")}>
                                    New Message
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
