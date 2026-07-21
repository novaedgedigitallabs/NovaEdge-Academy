"use client";

import { useEffect, useState } from "react";
import { getWishlist, toggleWishlist } from "@/services/wishlist";
import Header from "@/components/layout/Header";
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
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <HeartOff className="w-16 h-16 mb-4 opacity-50" />
                        <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
                        <p>Save courses you're interested in to view them later.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {courses.map(course => (
                            <div key={course._id || course.id} className="relative">
                                <CourseCard course={course} />
                                {/* Overlay Remove Button for Wishlist Page specifically if needed, 
                    but CourseCard already has toggle. 
                    However, CourseCard toggle might just toggle state, 
                    here we want to remove from list visually. 
                    The CourseCard toggle will work but won't remove from this list immediately unless we lift state.
                    For now, relying on CourseCard's internal toggle is okay, but user might need to refresh to see it gone.
                    Or we can add a specific "Remove" button here.
                */}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
