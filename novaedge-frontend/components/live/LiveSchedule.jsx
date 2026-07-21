"use client";

import { useEffect, useState } from "react";
import { getLiveClasses, createLiveClass } from "@/services/liveClass";
import LiveClassCard from "./LiveClassCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function LiveSchedule({ courseId, isEnrolled }) {
    const { user } = useAuth();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [link, setLink] = useState("");

    const fetchClasses = async () => {
        try {
            const data = await getLiveClasses(courseId);
            setClasses(data.classes);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [courseId]);

    const handleCreate = async () => {
        if (!title || !startTime || !endTime || !link) {
            toast.error("Please fill all fields");
            return;
        }
        try {
            await createLiveClass(courseId, {
                title,
                startTime,
                endTime,
                meetingLink: link,
                provider: "other" // Default for manual link
            });
            toast.success("Class scheduled");
            setOpen(false);
            fetchClasses();
        } catch (e) {
            toast.error("Failed to schedule");
        }
    };

    if (loading) return <div>Loading schedule...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Live Classes</h3>
                {user?.role === "admin" && (
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Schedule Class</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Schedule Live Class</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Start Time</Label>
                                        <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>End Time</Label>
                                        <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Meeting Link</Label>
                                    <Input placeholder="https://zoom.us/..." value={link} onChange={(e) => setLink(e.target.value)} />
                                </div>
                                <Button onClick={handleCreate} className="w-full">Schedule</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {classes.length === 0 ? (
                <p className="text-muted-foreground">No live classes scheduled.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {classes.map(c => (
                        <LiveClassCard key={c._id} liveClass={c} isEnrolled={isEnrolled || user?.role === "admin"} />
                    ))}
                </div>
            )}
        </div>
    );
}
