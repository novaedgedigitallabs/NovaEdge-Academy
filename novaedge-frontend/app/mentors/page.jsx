"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter, Globe, Briefcase, MapPin } from "lucide-react";
import Link from "next/link";

const mentors = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Senior Frontend Engineer",
        company: "Google",
        image: "https://i.pravatar.cc/150?u=sarah",
        bio: "Passionate about React, accessibility, and performance. I love helping beginners bridge the gap between theory and practice.",
        skills: ["React", "Next.js", "TypeScript"],
        social: { linkedin: "#", twitter: "#" },
    },
    {
        id: 2,
        name: "David Chen",
        role: "Staff Software Engineer",
        company: "Netflix",
        image: "https://i.pravatar.cc/150?u=david",
        bio: "Backend specialist with 10+ years of experience in distributed systems and microservices architecture.",
        skills: ["Node.js", "System Design", "AWS"],
        social: { linkedin: "#", website: "#" },
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Product Designer",
        company: "Airbnb",
        image: "https://i.pravatar.cc/150?u=emily",
        bio: "Design systems enthusiast. I mentor designers on how to create intuitive and beautiful user experiences.",
        skills: ["UI/UX", "Figma", "Design Systems"],
        social: { linkedin: "#", twitter: "#" },
    },
    {
        id: 4,
        name: "Michael Chang",
        role: "Machine Learning Engineer",
        company: "OpenAI",
        image: "https://i.pravatar.cc/150?u=michael",
        bio: "Working on large language models. Happy to guide you through the math and code behind modern AI.",
        skills: ["Python", "PyTorch", "NLP"],
        social: { linkedin: "#", website: "#" },
    },
    {
        id: 5,
        name: "Jessica Williams",
        role: "DevOps Engineer",
        company: "Spotify",
        image: "https://i.pravatar.cc/150?u=jessica",
        bio: "Automating everything. I can help you master CI/CD pipelines, Kubernetes, and cloud infrastructure.",
        skills: ["Kubernetes", "Docker", "Terraform"],
        social: { linkedin: "#", twitter: "#" },
    },
    {
        id: 6,
        name: "James Wilson",
        role: "Engineering Manager",
        company: "Microsoft",
        image: "https://i.pravatar.cc/150?u=james",
        bio: "Focusing on career growth, leadership, and soft skills for software engineers.",
        skills: ["Leadership", "Career Growth", "Management"],
        social: { linkedin: "#" },
    },
];

export default function MentorsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="bg-muted/30 py-20 border-b">
                <div className="container mx-auto px-4 text-center max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        Meet Our Mentors
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Learn from industry experts who have worked at top tech companies. Get guidance, code reviews, and career advice.
                    </p>
                </div>
            </section>

            {/* Mentors Grid */}
            <main className="flex-grow container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {mentors.map((mentor) => (
                        <Card key={mentor.id} className="flex flex-col hover:shadow-lg transition-shadow border-border/50">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto mb-4 relative">
                                    <Avatar className="w-24 h-24 border-4 border-background shadow-sm">
                                        <AvatarImage src={mentor.image} alt={mentor.name} />
                                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
                                        {mentor.company}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold">{mentor.name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                                    <Briefcase className="w-3 h-3" /> {mentor.role}
                                </p>
                            </CardHeader>

                            <CardContent className="flex-grow text-center">
                                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                    "{mentor.bio}"
                                </p>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {mentor.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="font-normal">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>

                            <CardFooter className="pt-0 flex justify-center gap-4 border-t p-4 bg-muted/20">
                                {mentor.social.linkedin && (
                                    <Link href={mentor.social.linkedin} className="text-muted-foreground hover:text-blue-600 transition-colors">
                                        <Linkedin className="w-5 h-5" />
                                    </Link>
                                )}
                                {mentor.social.twitter && (
                                    <Link href={mentor.social.twitter} className="text-muted-foreground hover:text-sky-500 transition-colors">
                                        <Twitter className="w-5 h-5" />
                                    </Link>
                                )}
                                {mentor.social.website && (
                                    <Link href={mentor.social.website} className="text-muted-foreground hover:text-foreground transition-colors">
                                        <Globe className="w-5 h-5" />
                                    </Link>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-20 text-center bg-primary/5 rounded-2xl p-12 border border-primary/10">
                    <h2 className="text-3xl font-bold mb-4">Want to become a mentor?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Share your knowledge and help the next generation of developers grow. Join our community of mentors today.
                    </p>
                    <Button asChild variant="outline" size="lg">
                        <Link href="/contact">Apply to Mentor</Link>
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    );
}
