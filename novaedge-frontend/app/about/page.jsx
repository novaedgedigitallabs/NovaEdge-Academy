"use client";

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Zap, Globe, Award, Rocket } from 'lucide-react';
import { getAllMentors } from "@/services/mentors";

export default function AboutPage() {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await getAllMentors();
                setMentors(res.data || []);
            } catch (error) {
                console.error("Failed to load mentors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-purple-500/30">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
                <div className="container relative mx-auto px-4 text-center">
                    <Badge variant="outline" className="mb-6 border-primary/50 text-primary">
                        About NovaEdge
                    </Badge>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Redefining the Future <br /> of <span className="text-primary">Digital Learning</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                        We are on a mission to empower the next generation of creators, developers, and innovators with world-class education and cutting-edge tools.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 border-y border-border bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { label: "Active Learners", value: "50K+" },
                            { label: "Expert Mentors", value: "100+" },
                            { label: "Courses", value: "200+" },
                            { label: "Countries", value: "150+" },
                        ].map((stat, index) => (
                            <div key={index}>
                                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                                <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Mission */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                Bridging the Gap Between <br />
                                <span className="text-primary">Potential and Mastery</span>
                            </h2>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                At NovaEdge, we believe that quality education should be accessible, engaging, and directly applicable to the real world. Traditional education often lags behind the rapid pace of technological advancement. We are here to change that.
                            </p>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                Our platform combines expert-led instruction with hands-on projects, ensuring that our students don't just learn concepts but master skills that are in high demand.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: Target, text: "Industry-Relevant Curriculum" },
                                    { icon: Zap, text: "Interactive Learning Experience" },
                                    { icon: Globe, text: "Global Community" },
                                    { icon: Award, text: "Recognized Certifications" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-3 text-muted-foreground">
                                        <item.icon className="w-5 h-5 text-primary" />
                                        <span>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <div className="relative bg-card border border-border rounded-2xl p-8 aspect-square flex flex-col justify-center items-center text-center shadow-2xl">
                                <Rocket className="w-24 h-24 text-primary mb-6" />
                                <h3 className="text-2xl font-bold mb-2">Launch Your Career</h3>
                                <p className="text-muted-foreground">Join thousands of students who have transformed their careers with NovaEdge.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet the Visionaries</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Our team consists of industry veterans, passionate educators, and tech innovators dedicated to your success.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center text-muted-foreground">Loading mentors...</div>
                    ) : mentors.length === 0 ? (
                        <div className="text-center text-muted-foreground">No mentors found.</div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            {mentors.map((mentor) => (
                                <Card key={mentor._id} className="bg-card border-border overflow-hidden group hover:border-primary/50 transition-colors">
                                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                                        {mentor.image && mentor.image !== 'no-photo.jpg' ? (
                                            <img
                                                src={mentor.image}
                                                alt={mentor.name}
                                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                <Users className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
                                    </div>
                                    <CardContent className="p-6 text-center">
                                        <h3 className="text-xl font-bold mb-1 text-foreground">{mentor.name}</h3>
                                        <p className="text-primary text-sm mb-4">{mentor.role}</p>
                                        <div
                                            className="text-muted-foreground text-sm line-clamp-3"
                                            dangerouslySetInnerHTML={{ __html: mentor.bio }}
                                        />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/10" />
                <div className="container relative mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
                        Join NovaEdge today and get unlimited access to our entire library of courses and learning paths.
                    </p>
                    <Button size="lg" className="px-8 h-12 text-lg">
                        Get Started Now
                    </Button>
                </div>
            </section>
        </div>
    );
}
