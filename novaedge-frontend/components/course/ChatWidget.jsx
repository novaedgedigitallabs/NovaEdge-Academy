"use client";

import { useState, useEffect, useRef } from "react";
import { getChatSession, sendChatMessage } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, X, Loader2, Bot } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function ChatWidget({ courseId, lectureId }) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [session, setSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (isOpen && !session && user) {
            getChatSession(courseId).then(res => {
                setSession(res.session);
                setMessages(res.session.messages || []);
            });
        }
    }, [isOpen, courseId, user]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !session) return;

        const userMsg = { role: "user", content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await sendChatMessage(session._id, userMsg.content, lectureId);
            setMessages(prev => [...prev, res.message]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            <Button
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <MessageSquare />}
            </Button>

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] shadow-xl z-50 flex flex-col">
                    <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bot className="w-5 h-5" /> Course Assistant
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-grow overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm mt-10">
                                <p>Hi! I can help you with course content.</p>
                                <p>Ask me anything about the lectures.</p>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-lg text-sm ${msg.role === "user"
                                            ? "bg-primary text-primary-foreground rounded-br-none"
                                            : "bg-muted rounded-bl-none"
                                        }`}
                                >
                                    <p>{msg.content}</p>
                                    {msg.citations && msg.citations.length > 0 && (
                                        <div className="mt-2 pt-2 border-t border-primary/20 text-xs opacity-80">
                                            Sources:
                                            {msg.citations.map((c, idx) => (
                                                <span key={idx} className="block">• {c.title}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-muted p-3 rounded-lg rounded-bl-none">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <div className="p-3 border-t bg-background">
                        <form onSubmit={handleSend} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question..."
                                className="flex-grow"
                            />
                            <Button type="submit" size="icon" disabled={loading}>
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}
        </>
    );
}
