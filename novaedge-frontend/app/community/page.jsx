"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { MessageSquare, Calendar, Github } from "lucide-react";

export default function CommunityPage() {
    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-6">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-2xl bg-card/40 border border-border/50 p-8 md:p-12 text-center mb-8 backdrop-blur-md shadow-xl">
                    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-3">
                        Join the <span className="text-primary">Community</span>
                    </h1>
                    <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
                        Connect with thousands of developers, designers, and creators. Share your work, get feedback, and grow together.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button className="rounded-full px-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                            <MessageSquare className="w-4 h-4" />
                            Join Discord
                        </Button>
                        <Button variant="outline" className="rounded-full px-6 gap-2 border-border/60 hover:bg-secondary">
                            <Github className="w-4 h-4" />
                            GitHub Discussions
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-secondary/30 border border-border/40 text-center mb-8">
                    <div>
                        <div className="text-2xl font-black text-primary">10k+</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Members</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-primary">500+</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Daily Messages</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-primary">50+</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Countries</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-primary">24/7</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Support</div>
                    </div>
                </div>

                {/* Events Section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">Upcoming Events</h2>
                            <p className="text-xs text-muted-foreground">Workshops, hackathons, and meetups.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 backdrop-blur-md hover:border-primary/50 transition-all flex flex-col justify-between">
                                <div className="p-5">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-primary mb-2">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Dec {10 + i}, 2025</span>
                                    </div>
                                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        Full Stack Workshop: Building Scalable Apps
                                    </h3>
                                    <p className="text-muted-foreground text-xs line-clamp-2">
                                        Join us for a deep dive into modern backend architecture and frontend performance.
                                    </p>
                                </div>
                                <div className="p-4 border-t border-border/40 bg-secondary/20 flex justify-end">
                                    <Button variant="ghost" size="sm" className="text-xs font-semibold text-primary p-0 hover:bg-transparent">
                                        Register Now &rarr;
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
