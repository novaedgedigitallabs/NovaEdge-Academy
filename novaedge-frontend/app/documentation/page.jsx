"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Book, Code, FileText, Terminal, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-8 space-y-8">
                {/* Hero Section */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        Documentation
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Everything you need to know about using NovaEdge Academy, from enrolled courses to certificates.
                    </p>
                </div>

                {/* Topics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-card/60 border border-border/70 shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
                        <div>
                            <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center border border-primary/20 mb-3">
                                <Book className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1">Getting Started</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Learn the basics of setting up your profile, enrolling in courses, and accessing mentorship.
                            </p>
                        </div>
                        <Link href="/help-center" className="text-xs font-semibold text-primary hover:underline mt-4 inline-flex items-center">
                            Read Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>

                    <div className="p-5 rounded-2xl bg-card/60 border border-border/70 shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
                        <div>
                            <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/20 mb-3">
                                <Terminal className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1">Interactive Quizzes & Code</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                How to complete quizzes, submit code assignments, and view automated feedback.
                            </p>
                        </div>
                        <Link href="/courses" className="text-xs font-semibold text-primary hover:underline mt-4 inline-flex items-center">
                            Explore Features <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>

                    <div className="p-5 rounded-2xl bg-card/60 border border-border/70 shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
                        <div>
                            <div className="h-10 w-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/20 mb-3">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1">Certificates & Verification</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Understanding how certificates are issued, verified via QR code, and shared on LinkedIn.
                            </p>
                        </div>
                        <Link href="/certificates" className="text-xs font-semibold text-primary hover:underline mt-4 inline-flex items-center">
                            View Certificates <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>

                    <div className="p-5 rounded-2xl bg-card/60 border border-border/70 shadow-md hover:border-primary/40 transition-all flex flex-col justify-between">
                        <div>
                            <div className="h-10 w-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/20 mb-3">
                                <Code className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground mb-1">For Instructors & Mentors</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Guides for creating course lectures, holding 1-on-1 mentorship calls, and answering student questions.
                            </p>
                        </div>
                        <Link href="/mentors" className="text-xs font-semibold text-primary hover:underline mt-4 inline-flex items-center">
                            Mentor Guide <ArrowRight className="w-3.5 h-3.5 ml-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
