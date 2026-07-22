"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Github, Plus, CheckCircle2, Clock, User, Loader2, Sparkles, ExternalLink, Video } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

const DEFAULT_EVENTS = [
    {
        id: "evt-1",
        title: "Full Stack Workshop: Building Scalable Apps",
        description: "Join us for a deep dive into modern backend architecture, microservices, and frontend performance optimizations.",
        date: "Dec 11, 2025",
        time: "7:00 PM IST",
        category: "Workshop",
        speaker: "Sarah Johnson",
        joinUrl: "https://discord.gg/novaedge-live-stage"
    },
    {
        id: "evt-2",
        title: "System Design & Distributed Systems",
        description: "Learn how high-traffic platforms handle millions of requests using Redis caching, Kafka, and sharded databases.",
        date: "Dec 15, 2025",
        time: "6:00 PM IST",
        category: "Masterclass",
        speaker: "David Chen",
        joinUrl: "https://meet.google.com/novaedge-system-design"
    },
    {
        id: "evt-3",
        title: "AI & LLM Integration in Web Apps",
        description: "Explore building production AI agents, prompt optimization, RAG pipelines, and vector database integrations.",
        date: "Dec 20, 2025",
        time: "8:00 PM IST",
        category: "Webinar",
        speaker: "Alex Rivera",
        joinUrl: "https://discord.gg/novaedge-ai-workshop"
    }
];

export default function CommunityPage() {
    const { user } = useAuth();
    const [events, setEvents] = useState(DEFAULT_EVENTS);
    const [registeredEvents, setRegisteredEvents] = useState({});
    const [loadingRegister, setLoadingRegister] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null);

    // Modal state for adding a new event
    const [isAddEventOpen, setIsAddEventOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventDate, setNewEventDate] = useState("");
    const [newEventTime, setNewEventTime] = useState("");
    const [newEventCategory, setNewEventCategory] = useState("Workshop");
    const [newEventDescription, setNewEventDescription] = useState("");
    const [newEventSpeaker, setNewEventSpeaker] = useState("");
    const [isSubmittingEvent, setIsSubmittingEvent] = useState(false);

    // Load saved custom events and registrations on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const customEvents = JSON.parse(localStorage.getItem("novaedge_community_events") || "[]");
            if (customEvents.length > 0) {
                setEvents([...customEvents, ...DEFAULT_EVENTS]);
            }

            const savedRegs = JSON.parse(localStorage.getItem("novaedge_event_registrations") || "{}");
            setRegisteredEvents(savedRegs);
        }
    }, []);

    // Handle Event Registration
    const handleRegister = (event, e) => {
        if (e) e.stopPropagation();
        const eventId = event.id;

        if (registeredEvents[eventId]) {
            // Already registered - open Event Details modal
            setSelectedEvent(event);
            return;
        }

        setLoadingRegister((prev) => ({ ...prev, [eventId]: true }));

        setTimeout(() => {
            // Update local state
            const updatedRegs = { ...registeredEvents, [eventId]: true };
            setRegisteredEvents(updatedRegs);
            localStorage.setItem("novaedge_event_registrations", JSON.stringify(updatedRegs));

            // Save to Upcoming Schedule in RightSidebar!
            const currentBookings = JSON.parse(localStorage.getItem("novaedge_my_bookings") || "[]");
            const newBookingItem = {
                id: `evt-reg-${eventId}`,
                title: event.title,
                date: event.date,
                time: event.time,
                type: event.category || "Event",
                href: "/community"
            };

            const updatedBookings = [newBookingItem, ...currentBookings];
            localStorage.setItem("novaedge_my_bookings", JSON.stringify(updatedBookings));

            setLoadingRegister((prev) => ({ ...prev, [eventId]: false }));
            toast.success(`🎉 Registered for "${event.title}"! Added to your Upcoming Schedule.`);
            
            // Dispatch custom event for real-time RightSidebar sync
            if (typeof window !== "undefined") {
                window.dispatchEvent(new Event("novaedge_booking_updated"));
                window.dispatchEvent(new Event("storage"));
            }
        }, 300);
    };

    // Handle Adding New Event
    const handleCreateEvent = (e) => {
        e.preventDefault();
        if (!newEventTitle || !newEventDate || !newEventTime || !newEventDescription) {
            toast.error("Please fill in all required event details.");
            return;
        }

        setIsSubmittingEvent(true);

        setTimeout(() => {
            const createdEvent = {
                id: `evt-${Date.now()}`,
                title: newEventTitle.trim(),
                date: newEventDate,
                time: newEventTime,
                category: newEventCategory,
                description: newEventDescription.trim(),
                speaker: newEventSpeaker.trim() || user?.name || "Community Host",
                joinUrl: "https://discord.gg/novaedge-live-stage"
            };

            const updatedEvents = [createdEvent, ...events];
            setEvents(updatedEvents);
            localStorage.setItem("novaedge_community_events", JSON.stringify([createdEvent, ...(JSON.parse(localStorage.getItem("novaedge_community_events") || "[]"))]));

            setIsSubmittingEvent(false);
            setIsAddEventOpen(false);

            // Reset Form
            setNewEventTitle("");
            setNewEventDate("");
            setNewEventTime("");
            setNewEventDescription("");
            setNewEventSpeaker("");

            toast.success("🚀 Event successfully published to the Community!");
        }, 400);
    };

    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-6 space-y-8">
                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-card/60 border border-border/70 p-8 md:p-12 text-center backdrop-blur-xl shadow-xl">
                    <div className="absolute right-6 top-6 h-32 w-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
                    

                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground mb-3 leading-tight">
                        Join the <span className="text-primary">Community</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mb-6 leading-relaxed">
                        Connect with thousands of developers, designers, and tech creators. Share your work, get feedback, and attend live workshops.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button 
                            className="rounded-full px-6 gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20 text-xs h-10 cursor-pointer"
                            onClick={() => window.open("https://discord.gg", "_blank")}
                        >
                            <MessageSquare className="w-4 h-4" />
                            Join Discord Server
                        </Button>
                        <Button 
                            variant="outline" 
                            className="rounded-full px-6 gap-2 border-border/70 hover:bg-secondary font-semibold text-xs h-10 cursor-pointer"
                            onClick={() => window.open("https://github.com", "_blank")}
                        >
                            <Github className="w-4 h-4" />
                            GitHub Discussions
                        </Button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-card/40 border border-border/60 text-center backdrop-blur-md">
                    <div>
                        <div className="text-2xl sm:text-3xl font-black text-primary">10k+</div>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">Active Members</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-black text-primary">500+</div>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">Daily Messages</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-black text-primary">50+</div>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">Countries</div>
                    </div>
                    <div>
                        <div className="text-2xl sm:text-3xl font-black text-primary">24/7</div>
                        <div className="text-xs text-muted-foreground font-medium mt-0.5">Live Support</div>
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" /> Upcoming Events
                            </h2>
                            <p className="text-xs text-muted-foreground">Workshops, hackathons, and live expert sessions.</p>
                        </div>
                        
                        {/* Add Event Button */}
                        <Button 
                            onClick={() => setIsAddEventOpen(true)}
                            size="sm"
                            className="rounded-full gap-1.5 font-bold text-xs h-9 px-4 bg-primary/15 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                        >
                            <Plus className="w-4 h-4" /> Add Event
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {events.map((event) => {
                            const isRegistered = !!registeredEvents[event.id];
                            const isLoading = !!loadingRegister[event.id];

                            return (
                                <div 
                                    key={event.id} 
                                    onClick={() => setSelectedEvent(event)}
                                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-card/50 backdrop-blur-md hover:border-primary/50 transition-all flex flex-col justify-between shadow-lg cursor-pointer"
                                >
                                    <div className="p-5 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{event.date}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-semibold border-border/60">
                                                {event.category || "Workshop"}
                                            </Badge>
                                        </div>

                                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                                            {event.title}
                                        </h3>
                                        
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                            {event.description}
                                        </p>

                                        <div className="flex items-center gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border/40">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-primary" /> {event.time}
                                            </span>
                                            {event.speaker && (
                                                <span className="flex items-center gap-1 truncate">
                                                    <User className="w-3 h-3 text-purple-400" /> {event.speaker}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-border/40 bg-secondary/20 flex items-center justify-between">
                                        <span className="text-[10px] font-semibold text-muted-foreground">
                                            {isRegistered ? "Click to view link" : "Seats available"}
                                        </span>
                                        <Button 
                                            size="sm"
                                            disabled={isLoading}
                                            onClick={(e) => handleRegister(event, e)}
                                            className={`rounded-full text-xs font-bold px-4 h-8 transition-all cursor-pointer flex items-center gap-1.5 ${
                                                isRegistered 
                                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30" 
                                                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                                            }`}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : isRegistered ? (
                                                <>
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                    Registered ✓
                                                </>
                                            ) : (
                                                <>
                                                    Register Now &rarr;
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* View Event Details & Join Live Stream Modal */}
            <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                {selectedEvent && (
                    <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/80 shadow-2xl rounded-2xl">
                        <DialogHeader className="border-b border-border/60 pb-3">
                            <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-bold">
                                    {selectedEvent.category || "Live Event"}
                                </Badge>
                                {registeredEvents[selectedEvent.id] && (
                                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-bold">
                                        Registered ✓
                                    </Badge>
                                )}
                            </div>
                            <DialogTitle className="text-lg font-bold leading-snug">
                                {selectedEvent.title}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground pt-1">
                                Hosted by <span className="text-foreground font-semibold">{selectedEvent.speaker || "NovaEdge Mentor"}</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-2">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {selectedEvent.description}
                            </p>

                            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-secondary/40 border border-border/60 text-xs">
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Date</span>
                                    <p className="font-semibold text-foreground mt-0.5">{selectedEvent.date}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Time</span>
                                    <p className="font-semibold text-primary mt-0.5">{selectedEvent.time}</p>
                                </div>
                            </div>

                            {registeredEvents[selectedEvent.id] ? (
                                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                                        <Video className="w-4 h-4" /> Live Session Stream Access
                                    </div>
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        You are registered for this event. Click below to join the live stream session when it starts.
                                    </p>
                                    <Button 
                                        onClick={() => window.open(selectedEvent.joinUrl || "https://discord.gg", "_blank")}
                                        className="w-full mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs gap-2 shadow-md cursor-pointer"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> Join Live Workshop Stream
                                    </Button>
                                </div>
                            ) : (
                                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2 text-center">
                                    <p className="text-xs text-muted-foreground">Register now to reserve your seat and unlock the live stream link.</p>
                                    <Button 
                                        onClick={(e) => {
                                            handleRegister(selectedEvent, e);
                                        }}
                                        className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-9 text-xs shadow-md cursor-pointer"
                                    >
                                        Register For Free Now
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            {/* Add Event Modal Dialog */}
            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/80 shadow-2xl rounded-2xl">
                    <DialogHeader className="border-b border-border/60 pb-3">
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <Plus className="w-5 h-5 text-primary" /> Add New Community Event
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Publish a workshop, hackathon, or meetup for community members.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreateEvent} className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Event Title *</label>
                            <Input 
                                placeholder="e.g. React 19 & Next.js Masterclass"
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="bg-secondary/40 border-border/80 h-9 text-xs rounded-xl"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-foreground">Date *</label>
                                <Input 
                                    placeholder="e.g. Dec 25, 2025"
                                    value={newEventDate}
                                    onChange={(e) => setNewEventDate(e.target.value)}
                                    className="bg-secondary/40 border-border/80 h-9 text-xs rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-foreground">Time *</label>
                                <Input 
                                    placeholder="e.g. 7:00 PM IST"
                                    value={newEventTime}
                                    onChange={(e) => setNewEventTime(e.target.value)}
                                    className="bg-secondary/40 border-border/80 h-9 text-xs rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-foreground">Category</label>
                                <select 
                                    value={newEventCategory}
                                    onChange={(e) => setNewEventCategory(e.target.value)}
                                    className="w-full h-9 rounded-xl border border-border/80 bg-secondary/40 px-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                    <option value="Workshop" className="bg-background">Workshop</option>
                                    <option value="Hackathon" className="bg-background">Hackathon</option>
                                    <option value="Webinar" className="bg-background">Webinar</option>
                                    <option value="Masterclass" className="bg-background">Masterclass</option>
                                    <option value="Meetup" className="bg-background">Meetup</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-foreground">Speaker / Host</label>
                                <Input 
                                    placeholder="e.g. Alex Rivera"
                                    value={newEventSpeaker}
                                    onChange={(e) => setNewEventSpeaker(e.target.value)}
                                    className="bg-secondary/40 border-border/80 h-9 text-xs rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-foreground">Event Description *</label>
                            <Textarea 
                                placeholder="Describe what attendees will learn in this session..."
                                value={newEventDescription}
                                onChange={(e) => setNewEventDescription(e.target.value)}
                                className="min-h-[90px] bg-secondary/40 border-border/80 text-xs rounded-xl resize-none"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setIsAddEventOpen(false)}
                                className="rounded-full text-xs font-semibold px-4 h-9"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={isSubmittingEvent}
                                size="sm" 
                                className="rounded-full text-xs font-bold px-5 h-9 bg-primary text-primary-foreground shadow-md cursor-pointer"
                            >
                                {isSubmittingEvent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Publish Event"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
