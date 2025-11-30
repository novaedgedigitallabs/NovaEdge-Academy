import React from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Building2, Users, BarChart3, Shield } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: 'For Business | NovaEdge Academy',
    description: 'Upskill your team with NovaEdge Academy for Business.',
};

export default function BusinessPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-muted/30 py-24 border-b">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">
                                    Upskill your team with <span className="text-primary">NovaEdge</span>
                                </h1>
                                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                    Give your team unlimited access to top-rated courses in software development, design, and data science. Boost productivity and retention with continuous learning.
                                </p>
                                <div className="flex gap-4">
                                    <Button size="lg" asChild>
                                        <Link href="/contact">Get a Demo</Link>
                                    </Button>
                                    <Button size="lg" variant="outline" asChild>
                                        <Link href="/pricing">View Pricing</Link>
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-3xl blur-3xl" />
                                <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Users className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Team Management</h3>
                                                <p className="text-sm text-muted-foreground">Easy admin controls</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <BarChart3 className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Usage Analytics</h3>
                                                <p className="text-sm text-muted-foreground">Track learning progress</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Shield className="h-6 w-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">SSO & Security</h3>
                                                <p className="text-sm text-muted-foreground">Enterprise-grade protection</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24">
                    <div className="container mx-auto px-4 max-w-6xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4">Why choose NovaEdge for Business?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We provide the tools and content your team needs to stay ahead in the rapidly evolving tech landscape.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                                <Building2 className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Scalable Learning</h3>
                                <p className="text-muted-foreground">
                                    Whether you have 5 or 5000 employees, our platform scales with your organization's needs.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                                <Check className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Curated Paths</h3>
                                <p className="text-muted-foreground">
                                    Custom learning paths designed to help your employees master specific skills and roles.
                                </p>
                            </div>
                            <div className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow">
                                <Users className="h-10 w-10 text-primary mb-4" />
                                <h3 className="text-xl font-bold mb-2">Dedicated Support</h3>
                                <p className="text-muted-foreground">
                                    Get priority support and a dedicated account manager to ensure your team's success.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-primary/5">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your team?</h2>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join hundreds of forward-thinking companies that trust NovaEdge for their employee training.
                        </p>
                        <Button size="lg" asChild className="px-8">
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
