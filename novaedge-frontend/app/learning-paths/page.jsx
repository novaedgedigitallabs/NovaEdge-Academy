"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, ArrowRight, Code, Database, Brain, Smartphone } from "lucide-react";
import Link from "next/link";

const paths = [
    {
        id: "full-stack",
        title: "Full Stack Web Developer",
        description: "Master both frontend and backend development. Build complete web applications from scratch using modern technologies like React, Node.js, and MongoDB.",
        icon: <Code className="w-8 h-8 text-blue-500" />,
        courses: 8,
        duration: "6 Months",
        level: "Beginner to Advanced",
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        id: "data-science",
        title: "Data Scientist",
        description: "Learn to analyze data, build machine learning models, and derive insights. Covers Python, Pandas, Scikit-learn, and Deep Learning.",
        icon: <Database className="w-8 h-8 text-green-500" />,
        courses: 6,
        duration: "5 Months",
        level: "Intermediate",
        color: "bg-green-500/10 text-green-500",
    },
    {
        id: "ai-engineer",
        title: "AI Engineer",
        description: "Dive into the world of Artificial Intelligence. Master Neural Networks, NLP, Computer Vision, and Generative AI.",
        icon: <Brain className="w-8 h-8 text-purple-500" />,
        courses: 10,
        duration: "8 Months",
        level: "Advanced",
        color: "bg-purple-500/10 text-purple-500",
    },
    {
        id: "mobile-dev",
        title: "Mobile App Developer",
        description: "Build native and cross-platform mobile apps for iOS and Android using React Native and Flutter.",
        icon: <Smartphone className="w-8 h-8 text-orange-500" />,
        courses: 5,
        duration: "4 Months",
        level: "Beginner",
        color: "bg-orange-500/10 text-orange-500",
    },
];

export default function LearningPathsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="bg-muted/30 py-20 border-b">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Curated Learning Paths
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Follow a structured roadmap to master a new skill. We've organized our courses into comprehensive paths to guide your journey.
                    </p>
                </div>
            </section>

            {/* Paths Grid */}
            <main className="flex-grow container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {paths.map((path) => (
                        <Card key={path.id} className="flex flex-col hover:shadow-lg transition-shadow border-border/50">
                            <CardHeader>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-xl ${path.color}`}>
                                        {path.icon}
                                    </div>
                                    <Badge variant="outline" className="text-sm">
                                        {path.level}
                                    </Badge>
                                </div>
                                <CardTitle className="text-2xl mb-2">{path.title}</CardTitle>
                                <p className="text-muted-foreground">{path.description}</p>
                            </CardHeader>

                            <CardContent className="flex-grow">
                                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-2">
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{path.courses} Courses</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{path.duration}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0">
                                <Button asChild className="w-full group">
                                    <Link href="/courses">
                                        Start Path <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center bg-primary/5 rounded-2xl p-12 border border-primary/10">
                    <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join thousands of students who have transformed their careers through our structured learning paths.
                    </p>
                    <Button asChild size="lg">
                        <Link href="/register">Join Now</Link>
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
