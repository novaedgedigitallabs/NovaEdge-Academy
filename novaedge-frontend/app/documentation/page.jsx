"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Book, Code, FileText, Terminal } from "lucide-react";
import Link from "next/link";

export default function DocumentationPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-background py-20 lg:py-24">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative max-w-7xl text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance mb-6">
                            Documentation
                        </h1>
                        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                            Everything you need to know about using NovaEdge Academy, from getting started to advanced API integrations.
                        </p>
                    </div>
                </section>

                {/* Topics Grid */}
                <section className="py-16 bg-muted/30 border-y border-border/40">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group cursor-pointer">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Book className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Getting Started</h3>
                                <p className="text-muted-foreground mb-4">
                                    Learn the basics of setting up your account, enrolling in courses, and navigating the platform.
                                </p>
                                <Link href="#" className="text-primary font-medium hover:underline">Read Guide &rarr;</Link>
                            </div>

                            {/* Card 2 */}
                            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group cursor-pointer">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Terminal className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Platform Features</h3>
                                <p className="text-muted-foreground mb-4">
                                    Deep dive into our interactive coding environments, quizzes, and project submissions.
                                </p>
                                <Link href="#" className="text-primary font-medium hover:underline">Explore Features &rarr;</Link>
                            </div>

                            {/* Card 3 */}
                            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group cursor-pointer">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">Certificates</h3>
                                <p className="text-muted-foreground mb-4">
                                    Understanding how certificates are generated, verified, and shared with employers.
                                </p>
                                <Link href="#" className="text-primary font-medium hover:underline">Learn about Certificates &rarr;</Link>
                            </div>

                            {/* Card 4 */}
                            <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors group cursor-pointer">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <Code className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">For Instructors</h3>
                                <p className="text-muted-foreground mb-4">
                                    Guides for creating courses, managing students, and tracking performance analytics.
                                </p>
                                <Link href="#" className="text-primary font-medium hover:underline">Instructor Guide &rarr;</Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
