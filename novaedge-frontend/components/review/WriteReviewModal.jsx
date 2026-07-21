"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { createReview } from "@/services/review";
import { toast } from "sonner";

export default function WriteReviewModal({ courseId, onReviewAdded }) {
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!comment.trim()) {
            toast.error("Please write a comment");
            return;
        }
        setLoading(true);
        try {
            await createReview(courseId, { rating, comment });
            toast.success("Review submitted!");
            setOpen(false);
            setComment("");
            setRating(5);
            if (onReviewAdded) onReviewAdded();
        } catch (e) {
            toast.error(e.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Write a Review</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rate this Course</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Share your experience..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                    <Button onClick={handleSubmit} disabled={loading} className="w-full">
                        {loading ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
