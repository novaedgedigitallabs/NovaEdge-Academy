"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, Coffee, Globe, ArrowRight } from 'lucide-react';
import { getAllPositions } from "@/services/careers";

export default function CareersPage() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const res = await getAllPositions();
                setPositions(res.data || []);
            } catch (error) {
                console.error("Failed to load positions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPositions();
    }, []);

    const benefits = [
        { icon: Heart, title: "Health & Wellness", description: "Comprehensive health coverage and wellness programs." },
        { icon: Zap, title: "Fast-Paced Growth", description: "Rapid career advancement in a high-growth environment." },
        { icon: Coffee, title: "Flexible Work", description: "Remote-first culture with flexible working hours." },
        { icon: Globe, title: "Global Team", description: "Work with talented individuals from around the world." },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                <div className="container relative mx-auto px-4 text-center">
                    <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
                        We are Hiring
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Build the Future of <span className="text-primary">EdTech</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        Join us in our mission to democratize education. We're looking for passionate, innovative, and driven individuals to join our team.
                    </p>
                    <Button size="lg" className="px-8 h-12 text-lg">
                        View Open Roles
                    </Button>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Work With Us?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            We take care of our team so they can take care of our students.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((benefit, index) => (
                            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors">
                                <CardContent className="p-6 pt-8 text-center">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                        <benefit.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-foreground">{benefit.title}</h3>
                                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Positions Section */}
            <section className="py-24">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
                        <p className="text-muted-foreground">
                            Find the role that fits you best.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center text-muted-foreground">Loading positions...</div>
                        ) : positions.length === 0 ? (
                            <div className="text-center text-muted-foreground">No open positions at the moment.</div>
                        ) : (
                            positions.map((position) => (
                                <div key={position._id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all cursor-pointer">
                                    <div className="mb-4 md:mb-0 text-center md:text-left">
                                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{position.title}</h3>
                                        <div className="flex items-center justify-center md:justify-start space-x-4 mt-2 text-sm text-muted-foreground">
                                            <span>{position.department}</span>
                                            <span>•</span>
                                            <span>{position.location}</span>
                                            <span>•</span>
                                            <span>{position.type}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" className="group-hover:translate-x-1 transition-transform text-primary hover:text-primary/80 hover:bg-primary/10">
                                        Apply Now <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
