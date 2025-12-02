"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getFriends } from "@/services/friend";
import { getMessages, sendMessage } from "@/services/message";
import Header from "@/components/layout/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Loader2, Send, MessageSquare, Bot } from "lucide-react";
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
        // For simplicity, just append or replace if it's at the end
        // Let's just set it to "@NovaEdge Academy " if it was just "@"
        if (newMessage.endsWith("@")) {
            setNewMessage(prev => prev + "NovaEdge Academy ");
        } else {
            // Replace word starting with @
            const parts = newMessage.split("@");
            parts.pop();
            setNewMessage(parts.join("@") + "@NovaEdge Academy ");
        }
        setShowAiSuggestion(false);
        // Focus input? It stays focused usually
    };

    if (authLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    if (!user) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <div className="flex-1 container mx-auto p-4 max-w-6xl h-[calc(100vh-64px)]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">

                    {/* Friends List Sidebar */}
                    <Card className="md:col-span-1 flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b font-semibold flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" /> Chats
                        </div>
                        <ScrollArea className="flex-1">
                            {loadingFriends ? (
                                <div className="p-4 text-center text-muted-foreground">Loading friends...</div>
                            ) : friends.length === 0 ? (
                                <div className="p-4 text-center text-muted-foreground">
                                    No friends yet. Search for users to add them!
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {friends.map(friend => (
                                        <button
                                            key={friend._id}
                                            onClick={() => setSelectedFriend(friend)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left",
                                                selectedFriend?._id === friend._id && "bg-muted"
                                            )}
                                        >
                                            <Avatar>
                                                <AvatarImage src={friend.avatar?.url} />
                                                <AvatarFallback>{friend.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="overflow-hidden">
                                                <p className="font-medium truncate">{friend.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">@{friend.username || "user"}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </Card>

                    {/* Chat Area */}
                    <Card className="md:col-span-3 flex flex-col h-full overflow-hidden">
                        {selectedFriend ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b flex items-center gap-3 bg-card z-10">
                                    <Avatar>
                                        <AvatarImage src={selectedFriend.avatar?.url} />
                                        <AvatarFallback>{selectedFriend.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h2 className="font-semibold">{selectedFriend.name}</h2>
                                        <p className="text-xs text-muted-foreground">@{selectedFriend.username || "user"}</p>
                                    </div>
                                </div>

                                {/* Messages */}
                                <ScrollArea className="flex-1 p-4">
                                    {loadingMessages ? (
                                        <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
                                    ) : messages.length === 0 ? (
                                        <div className="text-center text-muted-foreground py-10">
                                            No messages yet. Say hello!
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {messages.map((msg, i) => {
                                                const isMe = msg.sender === user._id;
                                                const isAi = msg.isAi;

                                                return (
                                                    <div key={i} className={cn("flex", isMe && !isAi ? "justify-end" : "justify-start")}>
                                                        <div className={cn(
                                                            "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                                                            isAi ? "bg-accent text-accent-foreground border border-primary/20" :
                                                                isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                                                        )}>
                                                            {isAi && (
                                                                <div className="flex items-center gap-2 mb-1 font-bold text-xs text-primary">
                                                                    <Bot className="w-3 h-3" /> NovaEdge AI
                                                                </div>
                                                            )}
                                                            <div className="prose dark:prose-invert text-sm max-w-none">
                                                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                                    {msg.message.replace("**NovaEdge AI:**", "").trim()}
                                                                </ReactMarkdown>
                                                            </div>
                                                            <p className={cn("text-[10px] mt-1 opacity-70", isMe && !isAi ? "text-primary-foreground" : "text-muted-foreground")}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={scrollRef} />
                                        </div>
                                    )}
                                </ScrollArea>

                                {/* Input Area */}
                                <div className="p-4 border-t bg-card">
                                    <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                                        {showAiSuggestion && (
                                            <div className="absolute bottom-full left-0 mb-2 bg-popover border rounded shadow-lg p-1 z-50">
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
                                            placeholder="Type a message... Use @ to mention AI"
                                            className="flex-1"
                                        />
                                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
                                <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                                <p>Select a friend to start chatting</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
