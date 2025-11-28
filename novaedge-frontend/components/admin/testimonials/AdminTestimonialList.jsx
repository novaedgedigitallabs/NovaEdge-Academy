"use client";

import { useState, useEffect } from "react";
import { getAdminTestimonials, updateTestimonial, deleteTestimonial, createTestimonial } from "@/services/testimonials";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X, Trash2, Star, Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminTestimonialList() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newTestimonial, setNewTestimonial] = useState({ text: "", video: null });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await getAdminTestimonials();
            setTestimonials(res.data);
        } catch (error) {
            toast.error("Failed to fetch testimonials");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateTestimonial(id, { status });
            toast.success(`Testimonial ${status}`);
            fetchTestimonials();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleFeatureToggle = async (id, currentVal) => {
        try {
            await updateTestimonial(id, { isFeatured: !currentVal });
            toast.success("Updated featured status");
            fetchTestimonials();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure? This will delete the video as well.")) return;
        try {
            await deleteTestimonial(id);
            toast.success("Testimonial deleted");
            fetchTestimonials();
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleEditSave = async () => {
        if (!editingTestimonial) return;
        try {
            await updateTestimonial(editingTestimonial._id, { text: editingTestimonial.text });
            toast.success("Testimonial updated");
            setEditingTestimonial(null);
            fetchTestimonials();
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newTestimonial.text) return toast.error("Text is required");

        const formData = new FormData();
        formData.append("text", newTestimonial.text);
        if (newTestimonial.video) formData.append("video", newTestimonial.video);

        try {
            await createTestimonial(formData);
            toast.success("Testimonial added");
            setIsAddOpen(false);
            setNewTestimonial({ text: "", video: null });
            fetchTestimonials();
        } catch (error) {
            toast.error("Failed to add testimonial");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Testimonial</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-text">Review Text</Label>
                                <Textarea
                                    id="new-text"
                                    value={newTestimonial.text}
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-video">Video (Optional)</Label>
                                <Input
                                    id="new-video"
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setNewTestimonial({ ...newTestimonial, video: e.target.files[0] })}
                                />
                            </div>
                            <Button type="submit" className="w-full">Submit</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Content</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : testimonials.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    No testimonials found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            testimonials.map((t) => (
                                <TableRow key={t._id}>
                                    <TableCell>{format(new Date(t.createdAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{t.user?.name}</span>
                                            <span className="text-xs text-muted-foreground">{t.user?.email}</span>
                                            {t.isVerifiedStudent && (
                                                <Badge variant="secondary" className="w-fit text-[10px] mt-1">Verified</Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[300px]">
                                        <p className="truncate text-sm">"{t.text}"</p>
                                        {t.videoUrl && (
                                            <a href={t.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                                                View Video
                                            </a>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={t.status === "approved" ? "success" : t.status === "rejected" ? "destructive" : "outline"}>
                                            {t.status}
                                        </Badge>
                                        {t.isFeatured && <Badge className="ml-2 bg-yellow-500">Featured</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => setEditingTestimonial(t)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            {t.status !== "approved" && (
                                                <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(t._id, "approved")}>
                                                    <Check className="h-4 w-4 text-green-500" />
                                                </Button>
                                            )}
                                            {t.status !== "rejected" && (
                                                <Button size="icon" variant="ghost" onClick={() => handleStatusUpdate(t._id, "rejected")}>
                                                    <X className="h-4 w-4 text-red-500" />
                                                </Button>
                                            )}
                                            <Button size="icon" variant="ghost" onClick={() => handleFeatureToggle(t._id, t.isFeatured)}>
                                                <Star className={`h-4 w-4 ${t.isFeatured ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"}`} />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingTestimonial} onOpenChange={(open) => !open && setEditingTestimonial(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Testimonial</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-text">Review Text</Label>
                            <Textarea
                                id="edit-text"
                                value={editingTestimonial?.text || ""}
                                onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingTestimonial(null)}>Cancel</Button>
                            <Button onClick={handleEditSave}>Save Changes</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
