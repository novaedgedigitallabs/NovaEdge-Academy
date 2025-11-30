"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Calendar, Github, Twitter } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background py-20 lg:py-32">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground text-balance mb-6">
                            Join the <span className="text-primary">Community</span>
                        </h1>
                        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto mb-10">
                            Connect with thousands of developers, designers, and creators. Share your work, get feedback, and grow together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="rounded-full px-8 h-12 gap-2">
                                <MessageSquare className="w-5 h-5" />
                                Join Discord
                            </Button>
                            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 gap-2 bg-transparent">
                                <Github className="w-5 h-5" />
                                GitHub Discussions
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12 border-y border-border/40 bg-muted/20">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-3xl font-bold text-primary mb-1">10k+</div>
                                <div className="text-sm text-muted-foreground">Members</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                                <div className="text-sm text-muted-foreground">Daily Messages</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary mb-1">50+</div>
                                <div className="text-sm text-muted-foreground">Countries</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                                <div className="text-sm text-muted-foreground">Support</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Events Section */}
                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight mb-4">Upcoming Events</h2>
                                <p className="text-muted-foreground">Workshops, hackathons, and meetups.</p>
                            </div>
                            <Button variant="ghost">View All</Button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:shadow-lg transition-all">
                                    <div className="aspect-video bg-muted relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                            Event Image Placeholder
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3">
                                            <Calendar className="w-4 h-4" />
                                            <span>Dec {10 + i}, 2025</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                            Full Stack Workshop: Building Scalable Apps
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4">
                                            Join us for a deep dive into modern backend architecture and frontend performance.
                                        </p>
                                        <Button variant="link" className="p-0 h-auto">Register Now &rarr;</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
