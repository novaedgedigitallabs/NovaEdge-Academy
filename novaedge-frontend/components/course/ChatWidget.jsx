"use client";

import { useState, useEffect, useRef } from "react";
import { getChatSession, sendChatMessage } from "@/services/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Send, X, Loader2, Bot, Maximize2, Minimize2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatWidget({ courseId, lectureId }) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
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
    }, [messages, isOpen, isExpanded]);

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
            {!isExpanded && (
                <Button
                    className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <MessageSquare />}
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className={`fixed shadow-xl z-50 flex flex-col transition-all duration-300 ${isExpanded
                    ? "inset-4 w-auto h-auto"
                    : "bottom-24 right-6 w-80 md:w-96 h-[500px]"
                    }`}>
                    <CardHeader className="p-4 border-b bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bot className="w-5 h-5" /> Course Assistant
                        </CardTitle>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                            {isExpanded && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsExpanded(false);
                                    }}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
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
                                    <div className="prose dark:prose-invert max-w-none prose-sm prose-p:leading-relaxed prose-pre:bg-black/10 prose-pre:p-2 prose-pre:rounded">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                                a: ({ node, ...props }) => <a className="underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />,
                                                code: ({ node, inline, className, children, ...props }) => {
                                                    return inline ? (
                                                        <code className="bg-black/10 px-1 py-0.5 rounded font-mono text-xs" {...props}>{children}</code>
                                                    ) : (
                                                        <code className="block bg-black/10 p-2 rounded font-mono text-xs overflow-x-auto my-2" {...props}>{children}</code>
                                                    )
                                                }
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>

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
