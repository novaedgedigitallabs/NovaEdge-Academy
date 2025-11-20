"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { enrollmentService } from "@/services/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CourseCard({ course }) {
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                // In a real app, we might pass enrollment status as a prop to avoid N+1 requests
                // But following the prompt logic: check GET /api/v1/enrollment/check/:courseId
                const data = await enrollmentService.checkEnrollment(course._id);
                setIsEnrolled(data.enrolled);
            } catch (error) {
                console.error("Failed to check enrollment", error);
            } finally {
                setLoading(false);
            }
        };

        // Only check if user is logged in (token exists)
        if (localStorage.getItem("token")) {
            checkStatus();
        } else {
            setLoading(false);
        }
    }, [course._id]);

    const handleAction = () => {
        if (isEnrolled) {
            router.push(`/course/${course._id}/learn`);
        } else {
            // Redirect to checkout or payment flow
            // For now, let's assume a simple buy action or redirect to details
            // The prompt says "Buy Now" or "Go to Course"
            console.log("Initiate purchase for", course._id);
            // In a real flow: paymentService.createCheckoutSession(course._id)
        }
    };

    return (
        <Card className="bg-gray-900 border-gray-800 overflow-hidden hover:border-blue-500/50 transition-all duration-300 group">
            <div className="aspect-video relative bg-gray-800">
                {/* Placeholder for thumbnail */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                        <span>No Thumbnail</span>
                    )}
                </div>
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/50 backdrop-blur text-white border-0">
                        ${course.price}
                    </Badge>
                </div>
            </div>

            <CardHeader>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                    {course.title}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <p className="text-gray-400 text-sm line-clamp-2">
                    {course.description || "Unlock your potential with this comprehensive course."}
                </p>
            </CardContent>

            <CardFooter>
                <Button
                    className={`w-full ${isEnrolled ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
                    onClick={handleAction}
                    disabled={loading}
                >
                    {loading ? "Loading..." : isEnrolled ? "Go to Course" : "Buy Now"}
                </Button>
            </CardFooter>
        </Card>
    );
}
