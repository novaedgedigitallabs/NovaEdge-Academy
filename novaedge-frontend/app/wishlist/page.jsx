"use client";

import { useEffect, useState } from "react";
import { getWishlist, toggleWishlist } from "@/services/wishlist";
import CourseCard from "@/components/course/CourseCard";
import { Loader2, HeartOff } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getWishlist();
                setCourses(data.wishlist || []);
            } catch (e) {
                toast.error("Failed to load wishlist");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleRemove = async (courseId) => {
        try {
            await toggleWishlist(courseId);
            setCourses(prev => prev.filter(c => (c._id || c.id) !== courseId));
            toast.success("Removed from wishlist");
        } catch (e) {
            toast.error("Failed to remove");
        }
    };

    return (
        <div className="w-full flex-grow px-4 py-6">
            <h1 className="text-2xl font-bold tracking-tight mb-8">My Wishlist</h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </div>
            ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <HeartOff className="w-16 h-16 mb-4 opacity-50" />
                    <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
                    <p>Save courses you&apos;re interested in to view them later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {courses.map(course => (
                        <div key={course._id || course.id} className="relative">
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
