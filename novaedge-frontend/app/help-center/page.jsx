"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, MessageCircle, Mail } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background py-20 lg:py-24">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-3xl text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-6">
                            How can we help?
                        </h1>
                        <div className="relative max-w-xl mx-auto">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search for answers..."
                                className="pl-10 h-12 text-lg bg-background/50 backdrop-blur border-muted-foreground/20"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ Categories */}
                <section className="py-16 bg-muted/30 border-y border-border/40">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                "How do I reset my password?",
                                "Where can I find my certificates?",
                                "Can I download videos for offline viewing?",
                                "How do I contact my mentor?",
                                "What is the refund policy?",
                                "How do I update my profile picture?"
                            ].map((q, i) => (
                                <div key={i} className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors cursor-pointer">
                                    <h3 className="font-semibold mb-2 flex items-start gap-2">
                                        <HelpCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        {q}
                                    </h3>
                                    <p className="text-sm text-muted-foreground ml-7">
                                        Click to read the detailed answer in our knowledge base.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Options */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                        <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
                        <p className="text-muted-foreground mb-12">Our support team is just a click away.</p>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-2xl bg-secondary/10 border border-border flex flex-col items-center">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <MessageCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Live Chat</h3>
                                <p className="text-muted-foreground mb-6">Chat with our support team in real-time.</p>
                                <Button>Start Chat</Button>
                            </div>

                            <div className="p-8 rounded-2xl bg-secondary/10 border border-border flex flex-col items-center">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                                <p className="text-muted-foreground mb-6">Get a response within 24 hours.</p>
                                <Button variant="outline">Contact Us</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
