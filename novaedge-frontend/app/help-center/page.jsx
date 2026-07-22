"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-8 space-y-10">
                {/* Hero Section */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                        How can we help?
                    </h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search for answers..."
                            className="pl-10 h-10 text-xs bg-secondary/40 border-border/80 rounded-full"
                        />
                    </div>
                </div>

                {/* FAQ Categories */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-foreground">Frequently Asked Questions</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { q: "How do I reset my password?", a: "Go to Settings > Security or click Forgot Password on the login screen." },
                            { q: "Where can I find my certificates?", a: "Navigate to Certificates on the left menu to view and download all your earned certificates." },
                            { q: "How do I book a mentor session?", a: "Go to Mentors on the left sidebar and click 'Book Session' on any mentor card." },
                            { q: "How do I update my profile details?", a: "Navigate to Settings > Profile to update avatar, cover image, and bio." },
                            { q: "What is the refund policy?", a: "We offer a 7-day money-back guarantee for all paid subscriptions." },
                            { q: "How do I submit assignments?", a: "Inside your course page, open the Assignment tab and click Submit File." }
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-card/60 border border-border/70 hover:border-primary/40 transition-colors">
                                <h3 className="font-semibold text-xs text-foreground mb-1 flex items-start gap-2">
                                    <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    {item.q}
                                </h3>
                                <p className="text-xs text-muted-foreground ml-6 leading-relaxed">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact Options */}
                <div className="p-6 rounded-2xl bg-card/40 border border-border/60 text-center space-y-4">
                    <h2 className="text-lg font-bold text-foreground">Still need help?</h2>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">Our support team is just a message away.</p>

                    <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto pt-2">
                        <Link href="/contact" className="p-4 rounded-xl bg-secondary/30 border border-border/60 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors">
                            <MessageCircle className="w-6 h-6 text-primary" />
                            <h3 className="text-xs font-bold text-foreground">Live Support</h3>
                            <Button size="sm" className="rounded-full text-xs h-7 px-4">Contact Support</Button>
                        </Link>

                        <Link href="/contact" className="p-4 rounded-xl bg-secondary/30 border border-border/60 flex flex-col items-center gap-2 hover:border-primary/40 transition-colors">
                            <Mail className="w-6 h-6 text-primary" />
                            <h3 className="text-xs font-bold text-foreground">Email Support</h3>
                            <Button size="sm" variant="outline" className="rounded-full text-xs h-7 px-4">Send Email</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
