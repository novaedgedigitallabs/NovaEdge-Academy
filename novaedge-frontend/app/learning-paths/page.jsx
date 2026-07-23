"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Trophy, ArrowRight, Code, Database, Brain, Smartphone, Sparkles } from "lucide-react";
import Link from "next/link";

const paths = [
    {
        id: "full-stack",
        title: "Full Stack Web Developer",
        description: "Master both frontend and backend development. Build complete web applications using React, Node.js, and MongoDB.",
        icon: <Code className="w-6 h-6 text-blue-500" />,
        courses: 8,
        duration: "6 Months",
        level: "Beginner to Advanced",
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        id: "data-science",
        title: "Data Scientist",
        description: "Learn to analyze data, build machine learning models, and derive insights using Python, Pandas, and Scikit-learn.",
        icon: <Database className="w-6 h-6 text-green-500" />,
        courses: 6,
        duration: "5 Months",
        level: "Intermediate",
        color: "bg-green-500/10 text-green-500",
    },
    {
        id: "ai-engineer",
        title: "AI Engineer",
        description: "Dive into Artificial Intelligence. Master Neural Networks, NLP, Computer Vision, and Generative AI.",
        icon: <Brain className="w-6 h-6 text-purple-500" />,
        courses: 10,
        duration: "8 Months",
        level: "Advanced",
        color: "bg-purple-500/10 text-purple-500",
    },
    {
        id: "mobile-dev",
        title: "Mobile App Developer",
        description: "Build native and cross-platform mobile apps for iOS and Android using React Native and Flutter.",
        icon: <Smartphone className="w-6 h-6 text-orange-500" />,
        courses: 5,
        duration: "4 Months",
        level: "Beginner",
        color: "bg-orange-500/10 text-orange-500",
    },
];

export default function LearningPathsPage() {
    return (
        <AppLayout className="w-full">
            <div className="px-4 py-8 space-y-8">
                {/* Hero Section */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        Curated Learning Paths
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        Follow structured step-by-step roadmaps to master industry skills and get job-ready.
                    </p>
                </div>

                {/* Paths Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paths.map((path) => (
                        <Card key={path.id} className="flex flex-col border-border/70 bg-card/50 backdrop-blur-md hover:border-primary/50 transition-all rounded-2xl">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <div className={`p-2.5 rounded-xl ${path.color}`}>
                                        {path.icon}
                                    </div>
                                    <Badge variant="outline" className="text-[10px] border-border/60">
                                        {path.level}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg font-bold">{path.title}</CardTitle>
                                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{path.description}</p>
                            </CardHeader>

                            <CardContent className="flex-grow pt-0">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="w-3.5 h-3.5 text-primary" />
                                        <span>{path.courses} Courses</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-primary" />
                                        <span>{path.duration}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="pt-2">
                                <Button asChild className="w-full rounded-full text-xs font-bold h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                                    <Link href="/courses">
                                        Start Path <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="text-center bg-card/40 backdrop-blur-md rounded-2xl p-6 border border-border/60 space-y-3">
                    <Trophy className="w-8 h-8 text-amber-400 mx-auto" />
                    <h2 className="text-lg font-bold text-foreground">Ready to start your journey?</h2>
                    <p className="text-xs text-muted-foreground max-w-md mx-auto">
                        Join thousands of students who have transformed their tech careers through our learning paths.
                    </p>
                    <Button asChild size="sm" className="rounded-full px-6 font-bold h-9 bg-primary text-primary-foreground">
                        <Link href="/register">Join Free Now</Link>
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
