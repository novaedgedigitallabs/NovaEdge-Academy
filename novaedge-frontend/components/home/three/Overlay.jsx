"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Overlay({ progress }) {
    // 0.00–0.20 -> Intro
    // 0.20–0.40 -> Learning
    // 0.40–0.60 -> Mentors
    // 0.60–0.80 -> Community
    // 0.80–1.00 -> CTA

    const getOpacity = (start, end) => {
        if (progress >= start && progress <= end) return 1;
        return 0;
    };

    const getTransform = (start, end) => {
        if (progress >= start && progress <= end) return "translateY(0)";
        return "translateY(20px)";
    };

    return (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
            {/* Intro Section */}
            <section
                className="absolute transition-all duration-500 ease-out"
                style={{ opacity: getOpacity(0, 0.2), transform: getTransform(0, 0.2) }}
            >
                <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
                    Welcome to <span className="text-primary">NovaEdge</span>
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    The future of learning is here. Scroll to explore.
                </p>
            </section>

            {/* Learning Section */}
            <section
                className="absolute transition-all duration-500 ease-out"
                style={{ opacity: getOpacity(0.2, 0.4), transform: getTransform(0.2, 0.4) }}
            >
                <h2 className="text-4xl font-bold sm:text-6xl">Learn Skills</h2>
                <p className="mt-4 text-xl text-muted-foreground">
                    Master the most in-demand technologies with our structured modules.
                </p>
            </section>

            {/* Mentors Section */}
            <section
                className="absolute transition-all duration-500 ease-out"
                style={{ opacity: getOpacity(0.4, 0.6), transform: getTransform(0.4, 0.6) }}
            >
                <h2 className="text-4xl font-bold sm:text-6xl">Learn from Mentors</h2>
                <p className="mt-4 text-xl text-muted-foreground">
                    Get direct guidance from industry experts and professionals.
                </p>
            </section>

            {/* Community Section */}
            <section
                className="absolute transition-all duration-500 ease-out"
                style={{ opacity: getOpacity(0.6, 0.8), transform: getTransform(0.6, 0.8) }}
            >
                <h2 className="text-4xl font-bold sm:text-6xl">Join the Community</h2>
                <p className="mt-4 text-xl text-muted-foreground">
                    Connect with thousands of learners and build your network.
                </p>
            </section>

            {/* CTA Section */}
            <section
                className="absolute transition-all duration-500 ease-out"
                style={{ opacity: getOpacity(0.8, 1), transform: getTransform(0.8, 1) }}
            >
                <h2 className="text-4xl font-bold sm:text-6xl">Ready to Start?</h2>
                <p className="mt-4 text-xl text-muted-foreground mb-8">
                    Join NovaEdge Academy today and transform your career.
                </p>
                <div className="pointer-events-auto flex gap-4 justify-center">
                    <Link href="/register">
                        <Button size="lg" className="rounded-full px-8 h-12 text-lg">
                            Get Started <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/login">
                        <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-lg bg-transparent">
                            Login
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 transition-opacity duration-300"
                style={{ opacity: progress > 0.1 ? 0 : 1 }}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-sm text-muted-foreground animate-pulse">Scroll to explore</span>
                    <div className="h-10 w-6 rounded-full border-2 border-muted-foreground p-1">
                        <div className="h-2 w-full rounded-full bg-muted-foreground animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
}
