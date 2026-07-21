"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from "@/components/ui/dialog";
import { Linkedin, Twitter, Globe, Briefcase, Calendar, MessageSquare, Check, Star, Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mentors = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Senior Frontend Engineer",
        company: "Google",
        image: "https://i.pravatar.cc/150?u=sarah",
        bio: "Passionate about React, accessibility, and performance. I love helping beginners bridge the gap between theory and practice.",
        skills: ["React", "Next.js", "TypeScript"],
        rating: 4.9,
        sessions: "120+",
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
        rating: 4.8,
        sessions: "95+",
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
        rating: 5.0,
        sessions: "150+",
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
        rating: 4.9,
        sessions: "80+",
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
        rating: 4.7,
        sessions: "65+",
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
        rating: 4.9,
        sessions: "200+",
        social: { linkedin: "#" },
    },
];

export default function MentorsPage() {
    const router = useRouter();
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [following, setFollowing] = useState({});
    const [bookingDate, setBookingDate] = useState("Tomorrow at 5:00 PM");

    const toggleFollow = (mentorId, name, e) => {
        if (e) e.stopPropagation();
        setFollowing((prev) => {
            const newState = !prev[mentorId];
            toast.success(newState ? `Now following ${name}` : `Unfollowed ${name}`);
            return { ...prev, [mentorId]: newState };
        });
    };

    const handleBookSession = (mentorName) => {
        toast.success(`1-on-1 Mentorship session request sent to ${mentorName}!`);
        setSelectedMentor(null);
    };

    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-6">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Meet Our Mentors
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Learn from industry experts who have worked at top tech companies. Get guidance, code reviews, and career advice. Click any mentor card to book a 1-on-1 session.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mentors.map((mentor) => {
                        const isFollowing = !!following[mentor.id];
                        return (
                            <Card 
                                key={mentor.id} 
                                onClick={() => setSelectedMentor(mentor)}
                                className="flex flex-col hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-border/60 bg-card/40 backdrop-blur-md overflow-hidden cursor-pointer group"
                            >
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto mb-3 relative">
                                        <Avatar className="w-20 h-20 border-2 border-primary/20 group-hover:border-primary/50 transition-colors shadow-md">
                                            <AvatarImage src={mentor.image} alt={mentor.name} />
                                            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                                {mentor.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                                            {mentor.company}
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                                        {mentor.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                        <Briefcase className="w-3 h-3 text-primary" /> {mentor.role}
                                    </p>
                                </CardHeader>

                                <CardContent className="flex-grow text-center px-4 py-2">
                                    <p className="text-muted-foreground text-xs mb-4 line-clamp-3 italic">
                                        &quot;{mentor.bio}&quot;
                                    </p>
                                    <div className="flex flex-wrap justify-center gap-1.5 mb-2">
                                        {mentor.skills.map((skill) => (
                                            <Badge key={skill} variant="secondary" className="font-semibold text-[10px] px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/50">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-3 flex items-center justify-between border-t border-border/40 p-3 bg-secondary/20">
                                    <div className="flex items-center gap-2">
                                        {mentor.social.linkedin && (
                                            <Link 
                                                href={mentor.social.linkedin} 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                            </Link>
                                        )}
                                        {mentor.social.twitter && (
                                            <Link 
                                                href={mentor.social.twitter} 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Twitter className="w-4 h-4" />
                                            </Link>
                                        )}
                                        {mentor.social.website && (
                                            <Link 
                                                href={mentor.social.website} 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                <Globe className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>

                                    <Button
                                        size="sm"
                                        variant={isFollowing ? "secondary" : "default"}
                                        onClick={(e) => toggleFollow(mentor.id, mentor.name, e)}
                                        className={cn(
                                            "rounded-full h-7 text-xs font-semibold px-3 transition-all",
                                            isFollowing
                                                ? "bg-primary/20 text-primary border border-primary/30"
                                                : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                        )}
                                    >
                                        {isFollowing ? (
                                            <>
                                                <Check className="w-3 h-3 mr-1" />
                                                Following
                                            </>
                                        ) : (
                                            "Book Session"
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* Call to Action */}
                <div className="mt-12 text-center bg-card/40 backdrop-blur-md rounded-2xl p-8 border border-border/50 shadow-xl">
                    <h2 className="text-xl font-bold mb-2 text-foreground">Want to become a mentor?</h2>
                    <p className="text-muted-foreground text-sm mb-6 max-w-xl mx-auto">
                        Share your knowledge and help the next generation of developers grow. Join our community of mentors today.
                    </p>
                    <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                        <Link href="/contact">Apply to Mentor</Link>
                    </Button>
                </div>
            </div>

            {/* Mentor Details & Booking Modal */}
            <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
                {selectedMentor && (
                    <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl p-6 shadow-2xl">
                        <DialogHeader className="text-left pb-2 border-b border-border/40">
                            <div className="flex items-center gap-4">
                                <Avatar className="w-16 h-16 border-2 border-primary/30 shadow-md">
                                    <AvatarImage src={selectedMentor.image} alt={selectedMentor.name} />
                                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                        {selectedMentor.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <DialogTitle className="text-xl font-bold text-foreground">
                                            {selectedMentor.name}
                                        </DialogTitle>
                                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                                            {selectedMentor.company}
                                        </Badge>
                                    </div>
                                    <DialogDescription className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                                        <Briefcase className="w-3.5 h-3.5 text-primary" /> {selectedMentor.role}
                                    </DialogDescription>
                                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                                        <span className="flex items-center text-amber-400 font-semibold">
                                            <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" /> {selectedMentor.rating}
                                        </span>
                                        <span>•</span>
                                        <span>{selectedMentor.sessions} Sessions Completed</span>
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 py-3">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">About Mentor</h4>
                                <p className="text-sm text-foreground/90 leading-relaxed">
                                    {selectedMentor.bio}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Areas of Expertise</h4>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedMentor.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="font-semibold text-xs px-3 py-1 rounded-full bg-secondary border border-border/60">
                                            <Sparkles className="w-3 h-3 mr-1 text-primary" />
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-secondary/40 border border-border/50 rounded-xl p-3.5 flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <Clock className="w-4 h-4 text-primary" />
                                    <div>
                                        <p className="text-xs font-semibold text-foreground">Next Available Slot</p>
                                        <p className="text-xs text-muted-foreground">{bookingDate}</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-400 bg-emerald-500/10">
                                    Available
                                </Badge>
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/40">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setSelectedMentor(null);
                                    router.push("/messages");
                                }}
                                className="rounded-full w-full sm:w-auto border-border/60"
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Send Message
                            </Button>
                            <Button 
                                onClick={() => handleBookSession(selectedMentor.name)} 
                                className="rounded-full w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Confirm 1-on-1 Session
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </AppLayout>
    );
}
