"use client";

import { useEffect, useState } from "react";
import { getDiscussions, createDiscussion, getDiscussion } from "@/services/discussion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import DiscussionThread from "./DiscussionThread";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export default function LectureDiscussionPanel({ courseId, lectureId }) {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
    const [selectedDiscussionData, setSelectedDiscussionData] = useState(null);

    // New Discussion State
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [openNew, setOpenNew] = useState(false);

    const fetchDiscussions = async () => {
        try {
            const data = await getDiscussions(courseId, lectureId);
            setDiscussions(data.discussions);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchSingleDiscussion = async (id) => {
        try {
            const data = await getDiscussion(id);
            setSelectedDiscussionData(data);
        } catch (e) {
            toast.error("Failed to load discussion");
        }
    };

    useEffect(() => {
        fetchDiscussions();
    }, [courseId, lectureId]);

    useEffect(() => {
        if (selectedDiscussionId) {
            fetchSingleDiscussion(selectedDiscussionId);
        } else {
            setSelectedDiscussionData(null);
        }
    }, [selectedDiscussionId]);

    const handleCreate = async () => {
        if (!newTitle.trim() || !newContent.trim()) return;
        try {
            await createDiscussion(courseId, lectureId, { title: newTitle, content: newContent });
            toast.success("Discussion created");
            setOpenNew(false);
            setNewTitle("");
            setNewContent("");
            fetchDiscussions();
        } catch (e) {
            toast.error(e.message || "Failed to create");
        }
    };

    if (loading) return <div className="p-4"><Loader2 className="animate-spin" /></div>;

    if (selectedDiscussionId && selectedDiscussionData) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => setSelectedDiscussionId(null)} className="mb-2">
                    ← Back to Discussions
                </Button>
                <DiscussionThread
                    discussion={selectedDiscussionData.discussion}
                    comments={selectedDiscussionData.comments}
                    onRefresh={() => fetchSingleDiscussion(selectedDiscussionId)}
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Q&A</h3>
                <Dialog open={openNew} onOpenChange={setOpenNew}>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Ask Question</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Ask a Question</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Input
                                placeholder="Title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                            <Textarea
                                placeholder="Describe your question..."
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                rows={5}
                            />
                            <Button onClick={handleCreate} className="w-full">Post Question</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-2">
                {discussions.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No questions yet.</p>
                ) : (
                    discussions.map(d => (
                        <div
                            key={d._id}
                            className="border p-3 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => setSelectedDiscussionId(d._id)}
                        >
                            <h4 className="font-semibold">{d.title}</h4>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                                <span>{d.upvotes.length} upvotes</span>
                                <span>by {d.user.name}</span>
                                <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
