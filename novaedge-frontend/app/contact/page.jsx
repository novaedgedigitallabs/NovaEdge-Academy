"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Clock, Send, Sparkles, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("mentor");
    const [message, setMessage] = useState("");

    const isFormValid = firstName && lastName && email && message;

    const handleSubmit = async () => {
        if (!isFormValid || loading) return;
        setLoading(true);
        setError(null);

        try {
            await apiPost("/api/v1/contact", {
                name: `${firstName.trim()} ${lastName.trim()}`,
                email: email.trim(),
                subject: subject || "General Inquiry",
                message: message.trim(),
            }).catch(() => null);

            setSubmitted(true);
            toast.success("🎉 Thank you! Your message has been sent successfully.");
            setFirstName("");
            setLastName("");
            setEmail("");
            setMessage("");
        } catch (err) {
            setError(err.message || "Failed to send message. Please try again.");
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-8 space-y-8">
                {/* Header Banner */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <Badge className="bg-primary/15 text-primary border-primary/30 px-3.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 text-primary" /> Contact & Support
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        Get in Touch with <span className="bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text text-transparent">NovaEdge</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Have questions about our courses, mentorship programs, or business inquiries? We&apos;re here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Contact Info Cards */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/70 shadow-md">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 bg-primary/15 rounded-xl text-primary shrink-0 border border-primary/20">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-foreground text-sm">Email Us</h3>
                                    <p className="text-[11px] text-muted-foreground">Responds within 24 hours.</p>
                                    <p className="text-xs font-semibold text-primary pt-1">support@novaedgeacademy.in</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/70 shadow-md">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 bg-purple-500/15 rounded-xl text-purple-400 shrink-0 border border-purple-500/20">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-foreground text-sm">Location</h3>
                                    <p className="text-[11px] text-muted-foreground">Headquarters & Innovation Hub</p>
                                    <p className="text-xs font-semibold text-foreground/90 pt-1">NovaEdge Digital Labs, India</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/70 shadow-md">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 bg-emerald-500/15 rounded-xl text-emerald-400 shrink-0 border border-emerald-500/20">
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-foreground text-sm">Response Time</h3>
                                    <p className="text-[11px] text-muted-foreground">24/7 Student Support</p>
                                    <p className="text-xs font-semibold text-emerald-400 pt-1">Fast ticket & chat responses</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-900/20 to-card border border-primary/30 text-left space-y-2">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                <h4 className="font-bold text-foreground text-xs">Need 1-on-1 Mentorship?</h4>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">
                                Schedule direct 1-on-1 calls with mentors on our Mentors portal.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-7">
                        <Card className="border-border/80 shadow-xl bg-card/70 backdrop-blur-xl rounded-2xl overflow-hidden">
                            <CardHeader className="border-b border-border/60 pb-5">
                                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <Send className="w-4 h-4 text-primary" /> Send us a Message
                                </CardTitle>
                                <CardDescription className="text-xs text-muted-foreground">
                                    Fill out the details below and we&apos;ll get back to you.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-5">
                                {submitted ? (
                                    <div className="text-center py-10 space-y-3">
                                        <div className="w-14 h-14 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                            <CheckCircle2 className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-xl font-black text-foreground">Message Received!</h3>
                                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                                            Thank you for reaching out to NovaEdge Academy. Our team will get back to you shortly.
                                        </p>
                                        <Button 
                                            onClick={() => setSubmitted(false)} 
                                            variant="outline"
                                            className="mt-2 rounded-full px-5 h-8 text-xs border-border/80 font-semibold"
                                        >
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {error && (
                                            <div className="bg-destructive/15 text-destructive border border-destructive/30 p-3 rounded-xl text-xs font-semibold">
                                                {error}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label htmlFor="firstName" className="text-xs font-bold text-foreground">First Name</label>
                                                <Input
                                                    id="firstName"
                                                    placeholder="John"
                                                    value={firstName}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="bg-secondary/40 border-border/80 h-9 text-xs rounded-xl"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label htmlFor="lastName" className="text-xs font-bold text-foreground">Last Name</label>
                                                <Input
                                                    id="lastName"
                                                    placeholder="Doe"
                                                    value={lastName}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    className="bg-secondary/40 border-border/80 h-9 text-xs rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="bg-secondary/40 border-border/80 h-9 text-xs rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="subject" className="text-xs font-bold text-foreground">Subject</label>
                                            <select
                                                id="subject"
                                                className="w-full h-9 rounded-xl border border-border/80 bg-secondary/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                            >
                                                <option value="mentor" className="bg-background text-foreground">Apply to be a Mentor</option>
                                                <option value="support" className="bg-background text-foreground">Course & Learning Support</option>
                                                <option value="business" className="bg-background text-foreground">Business & Partnership Inquiry</option>
                                                <option value="other" className="bg-background text-foreground">Other Questions</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1">
                                            <label htmlFor="message" className="text-xs font-bold text-foreground">Your Message</label>
                                            <Textarea
                                                id="message"
                                                placeholder="Tell us about your query or goal..."
                                                className="min-h-[120px] bg-secondary/40 border-border/80 text-xs rounded-xl resize-none"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                            />
                                        </div>

                                        <Button 
                                            className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md cursor-pointer text-xs"
                                            onClick={handleSubmit} 
                                            disabled={loading || !isFormValid}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Sending Message...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
