"use client";

import { useEffect, useState } from "react";
import { getReviews, markHelpful, reportReview, deleteReview } from "@/services/review";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, ThumbsUp, Flag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import WriteReviewModal from "./WriteReviewModal";
import { useAuth } from "@/context/auth-context";

export default function ReviewList({ courseId }) {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchReviews = async () => {
        try {
            const data = await getReviews(courseId, page);
            setReviews(data.reviews);
            setTotalPages(data.pages);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [courseId, page]);

    const handleHelpful = async (reviewId) => {
        if (!user) return toast.error("Login to vote");
        try {
            await markHelpful(reviewId);
            // Optimistic update or refetch
            fetchReviews();
        } catch (e) {
            toast.error("Failed to mark helpful");
        }
    };

    const handleReport = async (reviewId) => {
        if (!user) return toast.error("Login to report");
        try {
            await reportReview(reviewId, "Inappropriate content");
            toast.success("Review reported");
        } catch (e) {
            toast.error(e.message || "Failed to report");
        }
    };

    const handleDelete = async (reviewId) => {
        if (!confirm("Delete this review?")) return;
        try {
            await deleteReview(reviewId);
            toast.success("Review deleted");
            fetchReviews();
        } catch (e) {
            toast.error("Failed to delete");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Student Reviews</h3>
                {user && <WriteReviewModal courseId={courseId} onReviewAdded={fetchReviews} />}
            </div>

            {loading ? (
                <div>Loading reviews...</div>
            ) : reviews.length === 0 ? (
                <div className="text-muted-foreground">No reviews yet. Be the first to review!</div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b pb-6">
                            <div className="flex items-start justify-between">
                                <div className="flex gap-3">
                                    <Avatar>
                                        <AvatarImage src={review.user.avatar?.url} />
                                        <AvatarFallback>{review.user.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{review.user.name}</div>
                                        <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                                                />
                                            ))}
                                            <span className="text-muted-foreground ml-2 text-xs">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {user && user._id === review.user._id && (
                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(review._id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                )}
                            </div>

                            <p className="mt-3 text-sm">{review.comment}</p>

                            <div className="flex gap-4 mt-4">
                                <button
                                    onClick={() => handleHelpful(review._id)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                                >
                                    <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful.length})
                                </button>
                                <button
                                    onClick={() => handleReport(review._id)}
                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500"
                                >
                                    <Flag className="w-3 h-3" /> Report
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
