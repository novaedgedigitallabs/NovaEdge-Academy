"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
            <Header />

            <main className="flex-grow relative overflow-hidden">
                {/* Background Ambient Glowing Orbs */}
                <div className="absolute left-1/4 top-10 -z-10 h-[350px] w-[350px] rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
                <div className="absolute right-1/4 bottom-20 -z-10 h-[300px] w-[300px] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 max-w-6xl">
                    
                    {/* Header Banner */}
                    <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
                        <Badge className="bg-primary/15 text-primary border-primary/30 px-3.5 py-1 text-xs font-bold rounded-full inline-flex items-center gap-1.5 shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-primary" /> Contact & Support
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
                            Get in Touch with <span className="bg-gradient-to-r from-primary via-purple-400 to-indigo-400 bg-clip-text text-transparent">NovaEdge</span>
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                            Have questions about our courses, mentorship programs, or business inquiries? We&apos;re here to help you accelerate your learning journey.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10 items-start">

                        {/* Left Column: Contact Info Cards */}
                        <div className="lg:col-span-5 space-y-5">
                            
                            <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/70 shadow-lg hover:border-primary/40 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/15 rounded-xl text-primary shrink-0 border border-primary/20">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-foreground text-base">Email Us</h3>
                                        <p className="text-xs text-muted-foreground">Our team responds within 24 hours.</p>
                                        <p className="text-sm font-semibold text-primary pt-1">support@novaedgeacademy.in</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/70 shadow-lg hover:border-primary/40 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-purple-500/15 rounded-xl text-purple-400 shrink-0 border border-purple-500/20">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-foreground text-base">Location</h3>
                                        <p className="text-xs text-muted-foreground">Headquarters & Innovation Hub</p>
                                        <p className="text-sm font-semibold text-foreground/90 pt-1">NovaEdge Digital Labs, Technology Park, India</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/70 shadow-lg hover:border-primary/40 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-emerald-500/15 rounded-xl text-emerald-400 shrink-0 border border-emerald-500/20">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-foreground text-base">Response Time</h3>
                                        <p className="text-xs text-muted-foreground">24/7 Student Support</p>
                                        <p className="text-sm font-semibold text-emerald-400 pt-1">Fast ticket & chat responses</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mentorship CTA Card */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-900/20 to-card border border-primary/30 shadow-xl text-left space-y-3">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    <h4 className="font-bold text-foreground text-sm">Looking for 1-on-1 Mentorship?</h4>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    You can directly schedule 1-on-1 calls with industry leaders from Google, Netflix, and OpenAI on our Mentors portal.
                                </p>
                            </div>

                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="lg:col-span-7">
                            <Card className="border-border/80 shadow-2xl bg-card/70 backdrop-blur-xl rounded-3xl overflow-hidden">
                                <CardHeader className="border-b border-border/60 pb-6">
                                    <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                                        <Send className="w-5 h-5 text-primary" /> Send us a Message
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">
                                        Fill out the details below and we&apos;ll get back to you as soon as possible.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-6">
                                    {submitted ? (
                                        <div className="text-center py-12 space-y-4">
                                            <div className="w-16 h-16 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <h3 className="text-2xl font-black text-foreground">Message Received!</h3>
                                            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                                                Thank you for reaching out to NovaEdge Academy. Our team has received your message and will get back to you shortly.
                                            </p>
                                            <Button 
                                                onClick={() => setSubmitted(false)} 
                                                variant="outline"
                                                className="mt-4 rounded-full px-6 border-border/80 font-semibold"
                                            >
                                                Send Another Message
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            {error && (
                                                <div className="bg-destructive/15 text-destructive border border-destructive/30 p-3.5 rounded-xl text-xs font-semibold">
                                                    {error}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label htmlFor="firstName" className="text-xs font-bold text-foreground">First Name</label>
                                                    <Input
                                                        id="firstName"
                                                        placeholder="John"
                                                        value={firstName}
                                                        onChange={(e) => setFirstName(e.target.value)}
                                                        className="bg-secondary/40 border-border/80 h-10 text-xs rounded-xl"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label htmlFor="lastName" className="text-xs font-bold text-foreground">Last Name</label>
                                                    <Input
                                                        id="lastName"
                                                        placeholder="Doe"
                                                        value={lastName}
                                                        onChange={(e) => setLastName(e.target.value)}
                                                        className="bg-secondary/40 border-border/80 h-10 text-xs rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="john@example.com"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="bg-secondary/40 border-border/80 h-10 text-xs rounded-xl"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label htmlFor="subject" className="text-xs font-bold text-foreground">Subject</label>
                                                <select
                                                    id="subject"
                                                    className="w-full h-10 rounded-xl border border-border/80 bg-secondary/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                                    value={subject}
                                                    onChange={(e) => setSubject(e.target.value)}
                                                >
                                                    <option value="mentor" className="bg-background text-foreground">Apply to be a Mentor</option>
                                                    <option value="support" className="bg-background text-foreground">Course & Learning Support</option>
                                                    <option value="business" className="bg-background text-foreground">Business & Partnership Inquiry</option>
                                                    <option value="other" className="bg-background text-foreground">Other Questions</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label htmlFor="message" className="text-xs font-bold text-foreground">Your Message</label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Tell us about your query, experience, or goals..."
                                                    className="min-h-[140px] bg-secondary/40 border-border/80 text-xs rounded-xl resize-none"
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                />
                                            </div>

                                            <Button 
                                                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/25 cursor-pointer text-sm"
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
            </main>

            <Footer />
        </div>
    );
}
