"use client";

import { useEffect, useState } from "react";
import { courseService } from "@/services/api";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await courseService.getAllCourses();
                // Assuming API returns { success: true, data: [...] } or just [...]
                // Adjust based on actual API response structure. 
                // Based on standard practices, it might be data.data or just data.
                // Let's assume data is the array or data.courses is the array.
                // Safest bet: check if Array.isArray(data) else data.data || data.courses
                const courseList = Array.isArray(data) ? data : (data.data || data.courses || []);
                setCourses(courseList);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                        Explore Our Courses
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Master new skills with our futuristic learning platform.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-48 w-full bg-gray-800 rounded-xl" />
                                <Skeleton className="h-4 w-3/4 bg-gray-800" />
                                <Skeleton className="h-4 w-1/2 bg-gray-800" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
