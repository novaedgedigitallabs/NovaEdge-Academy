"use client";

import React from 'react';
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Building2, Users, BarChart3, Shield, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function BusinessPage() {
    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-8 space-y-12">
                {/* Hero Section */}
                <div className="text-center max-w-2xl mx-auto space-y-4">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        Upskill your team with <span className="text-primary">NovaEdge</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Give your team unlimited access to top-rated courses in software development, design, and data science. Boost productivity and retention with continuous learning.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <Button size="sm" asChild className="rounded-full font-bold h-9 px-5 bg-primary text-primary-foreground">
                            <Link href="/contact">Get a Demo <ArrowRight className="ml-1.5 w-3.5 h-3.5" /></Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild className="rounded-full font-semibold h-9 px-5 border-border/80">
                            <Link href="/pricing">View Pricing</Link>
                        </Button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-card/60 border border-border/70 shadow-md flex flex-col gap-2">
                        <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20">
                            <Users className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground">Team Management</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Easy admin controls to assign seats, manage permissions, and track individual progress.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-card/60 border border-border/70 shadow-md flex flex-col gap-2">
                        <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground">Usage Analytics</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Real-time reporting dashboards showing course completions and skill benchmarks.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-card/60 border border-border/70 shadow-md flex flex-col gap-2">
                        <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground">SSO & Security</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            Enterprise-grade protection with SAML SSO, data encryption, and priority support.
                        </p>
                    </div>
                </div>

                {/* Benefits List */}
                <div className="p-6 rounded-2xl bg-card/40 border border-border/60 space-y-4">
                    <h2 className="text-lg font-bold text-foreground text-center">Why NovaEdge for Business?</h2>
                    <div className="grid sm:grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                            <Building2 className="w-6 h-6 text-primary mx-auto" />
                            <h4 className="text-xs font-bold text-foreground">Scalable Learning</h4>
                            <p className="text-[11px] text-muted-foreground">Scales seamlessly from 5 to 5,000 employees.</p>
                        </div>
                        <div className="space-y-1">
                            <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                            <h4 className="text-xs font-bold text-foreground">Curated Paths</h4>
                            <p className="text-[11px] text-muted-foreground">Tailored role-based learning curriculums.</p>
                        </div>
                        <div className="space-y-1">
                            <Users className="w-6 h-6 text-purple-400 mx-auto" />
                            <h4 className="text-xs font-bold text-foreground">Dedicated Support</h4>
                            <p className="text-[11px] text-muted-foreground">Priority account manager & live support.</p>
                        </div>
                    </div>
                </div>

                {/* CTA Card */}
                <div className="p-6 rounded-2xl bg-card/60 border border-primary/30 text-center space-y-3">
                    <h2 className="text-lg font-bold text-foreground">Ready to transform your engineering team?</h2>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        Join forward-thinking companies that trust NovaEdge for their employee tech training.
                    </p>
                    <Button size="sm" asChild className="rounded-full px-6 font-bold h-9 bg-primary text-primary-foreground">
                        <Link href="/contact">Contact Sales Team</Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
