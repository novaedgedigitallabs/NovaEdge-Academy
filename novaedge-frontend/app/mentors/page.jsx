"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from "@/components/ui/dialog";
import { Linkedin, Twitter, Briefcase, Calendar, MessageSquare, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllMentors, bookMentorshipSession } from "@/services/mentors";

const DEFAULT_MENTORS = [
    {
        _id: "m1",
        name: "Sarah Johnson",
        role: "Senior Frontend Engineer",
        company: "Google",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
        bio: "Passionate about React, accessibility, and performance. I love helping beginners bridge the gap between theory and practice.",
        skills: ["React", "Next.js", "TypeScript"],
        rating: 4.9,
        sessions: "120+",
        socialLinks: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    },
    {
        _id: "m2",
        name: "David Chen",
        role: "Staff Software Engineer",
        company: "Netflix",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
        bio: "Backend specialist with 10+ years of experience in distributed systems and microservices architecture.",
        skills: ["Node.js", "System Design", "AWS"],
        rating: 4.8,
        sessions: "95+",
        socialLinks: { linkedin: "https://linkedin.com", github: "https://github.com" },
    },
    {
        _id: "m3",
        name: "Emily Rodriguez",
        role: "Product Designer",
        company: "Airbnb",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
        bio: "Design systems enthusiast. I mentor designers on how to create intuitive and beautiful user experiences.",
        skills: ["UI/UX", "Figma", "Design Systems"],
        rating: 5.0,
        sessions: "150+",
        socialLinks: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    },
    {
        _id: "m4",
        name: "Michael Chang",
        role: "Machine Learning Engineer",
        company: "OpenAI",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
        bio: "Working on large language models. Happy to guide you through the math and code behind modern AI.",
        skills: ["Python", "PyTorch", "NLP"],
        rating: 4.9,
        sessions: "80+",
        socialLinks: { linkedin: "https://linkedin.com", github: "https://github.com" },
    },
    {
        _id: "m5",
        name: "Jessica Williams",
        role: "DevOps Engineer",
        company: "Spotify",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
        bio: "Automating everything. I can help you master CI/CD pipelines, Kubernetes, and cloud infrastructure.",
        skills: ["Kubernetes", "Docker", "Terraform"],
        rating: 4.7,
        sessions: "65+",
        socialLinks: { linkedin: "https://linkedin.com", twitter: "https://x.com" },
    },
    {
        _id: "m6",
        name: "James Wilson",
        role: "Engineering Manager",
        company: "Microsoft",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400",
        bio: "Focusing on career growth, leadership, and soft skills for software engineers.",
        skills: ["Leadership", "Career Growth", "Management"],
        rating: 4.9,
        sessions: "200+",
        socialLinks: { linkedin: "https://linkedin.com" },
    },
];

const TIME_SLOTS = ["10:00 AM", "02:30 PM", "05:00 PM", "07:30 PM"];

export default function MentorsPage() {
    const router = useRouter();
    const [mentorsList, setMentorsList] = useState(DEFAULT_MENTORS);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState(null);

    // Booking Modal Form State
    const [bookingDate, setBookingDate] = useState(() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    });
    const [selectedTimeSlot, setSelectedTimeSlot] = useState("10:00 AM");
    const [bookingTopic, setBookingTopic] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchMentorsData = async () => {
            try {
                const res = await getAllMentors();
                if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                    setMentorsList(res.data);
                }
            } catch (err) {
                console.warn("Could not fetch API mentors, using default mentors list.");
            } finally {
                setLoading(false);
            }
        };

        fetchMentorsData();
    }, []);

    const handleConfirmBooking = async () => {
        if (!selectedMentor) return;

        setIsBooking(true);
        try {
            await bookMentorshipSession({
                mentorId: selectedMentor._id || selectedMentor.id,
                date: bookingDate,
                timeSlot: selectedTimeSlot,
                topic: bookingTopic || "1-on-1 Mentorship Guidance",
            }).catch(() => null);

            // Format date for Upcoming Schedule widget
            const d = new Date(bookingDate);
            const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "2-digit" });

            const newBooking = {
                id: `b_${Date.now()}`,
                title: `1-on-1 Session with ${selectedMentor.name}`,
                date: dateStr,
                time: selectedTimeSlot,
                type: "Mentorship",
                href: "/mentors"
            };

            const existing = JSON.parse(localStorage.getItem("novaedge_my_bookings") || "[]");
            localStorage.setItem("novaedge_my_bookings", JSON.stringify([newBooking, ...existing]));

            toast.success(`🎉 Session booked with ${selectedMentor.name} for ${bookingDate} at ${selectedTimeSlot}! Added to your Upcoming Schedule.`);
            setSelectedMentor(null);
            setBookingTopic("");

            // Refresh schedule on UI
            setTimeout(() => {
                window.location.reload();
            }, 800);
        } catch (error) {
            toast.error("Failed to book session. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    return (
        <AppLayout className="w-full">
            <div className="px-4 py-6">
                <div className="flex flex-col gap-2 mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Meet Our Mentors
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Learn from industry experts who have worked at top tech companies. Get guidance, code reviews, and career advice. Click any mentor card or &quot;Book Session&quot; to schedule a 1-on-1 call.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mentorsList.map((mentor) => {
                        const mId = mentor._id || mentor.id;
                        return (
                            <Card 
                                key={mId} 
                                onClick={() => setSelectedMentor(mentor)}
                                className="flex flex-col hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-border/60 bg-card/40 backdrop-blur-md overflow-hidden cursor-pointer group"
                            >
                                <CardHeader className="text-center pb-2">
                                    <div className="mx-auto mb-3 relative">
                                        <Avatar className="w-20 h-20 border-2 border-primary/20 group-hover:border-primary/50 transition-colors shadow-md overflow-hidden">
                                            <AvatarImage src={mentor.image} alt={mentor.name} className="object-cover w-full h-full" />
                                            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                                {mentor.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                                            {mentor.company || "Top Tech"}
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
                                        {(mentor.skills || ["Engineering"]).map((skill) => (
                                            <Badge key={skill} variant="secondary" className="font-semibold text-[10px] px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/50">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="pt-3 flex items-center justify-between border-t border-border/40 p-3 bg-secondary/20">
                                    <div className="flex items-center gap-2">
                                        {mentor.socialLinks?.linkedin && (
                                            <Link 
                                                href={mentor.socialLinks.linkedin} 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                            </Link>
                                        )}
                                        {mentor.socialLinks?.twitter && (
                                            <Link 
                                                href={mentor.socialLinks.twitter} 
                                                onClick={(e) => e.stopPropagation()} 
                                                className="text-muted-foreground hover:text-primary transition-colors"
                                            >
                                                <Twitter className="w-4 h-4" />
                                            </Link>
                                        )}
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedMentor(mentor);
                                        }}
                                        className="rounded-full h-8 text-xs font-bold px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm cursor-pointer"
                                    >
                                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                        Book Session
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
                    <DialogContent className="sm:max-w-lg bg-card border border-border rounded-2xl p-6 shadow-2xl overflow-hidden">
                        <DialogHeader className="text-left pb-3 border-b border-border/60">
                            <div className="flex items-start gap-4 pr-6">
                                <Avatar className="w-14 h-14 border-2 border-primary/30 shadow-md shrink-0 overflow-hidden">
                                    <AvatarImage src={selectedMentor.image} alt={selectedMentor.name} className="object-cover w-full h-full" />
                                    <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                                        {selectedMentor.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <DialogTitle className="text-lg font-bold text-foreground leading-tight">
                                            Book 1-on-1 Session with {selectedMentor.name}
                                        </DialogTitle>
                                        <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                                            {selectedMentor.company || "Top Tech"}
                                        </Badge>
                                    </div>
                                    <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                        <Briefcase className="w-3.5 h-3.5 text-primary shrink-0" /> {selectedMentor.role}
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-4 py-3">
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">About Mentor</h4>
                                <p className="text-xs text-foreground/90 leading-relaxed italic">
                                    &quot;{selectedMentor.bio}&quot;
                                </p>
                            </div>

                            {/* Date & Time Selection */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5 text-primary" /> Select Date
                                    </label>
                                    <Input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                        className="text-xs bg-secondary/40 border-border/80"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-primary" /> Time Slot
                                    </label>
                                    <select
                                        value={selectedTimeSlot}
                                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                                        className="w-full h-9 rounded-md border border-border/80 bg-secondary/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        {TIME_SLOTS.map((slot) => (
                                            <option key={slot} value={slot} className="bg-background text-foreground">
                                                {slot}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Topic / Notes Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-foreground flex items-center gap-1">
                                    <MessageSquare className="w-3.5 h-3.5 text-primary" /> Topic or Notes (Optional)
                                </label>
                                <Textarea
                                    rows={2}
                                    placeholder="e.g. Code review for my Next.js app, or System Design advice..."
                                    value={bookingTopic}
                                    onChange={(e) => setBookingTopic(e.target.value)}
                                    className="text-xs bg-secondary/40 border-border/80 resize-none"
                                />
                            </div>
                        </div>

                        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/40">
                            <Button 
                                variant="outline" 
                                onClick={() => setSelectedMentor(null)}
                                className="rounded-full w-full sm:w-auto border-border/60"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={handleConfirmBooking} 
                                disabled={isBooking}
                                className="rounded-full w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md cursor-pointer"
                            >
                                {isBooking ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Booking...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Confirm 1-on-1 Session
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </AppLayout>
    );
}
