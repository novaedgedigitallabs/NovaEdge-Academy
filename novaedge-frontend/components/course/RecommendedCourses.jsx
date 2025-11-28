"use client";

import { useEffect, useState } from "react";
import { getRecommendations } from "@/services/recommendation";
import CourseCard from "./CourseCard";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function RecommendedCourses() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            getRecommendations().then(res => {
                setCourses(res.recommendations);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user || courses.length === 0) return null;

    return (
        <section className="py-12">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-2 mb-8">
                    <Sparkles className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-3xl font-bold">Recommended for You</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <div key={course._id} className="relative group">
                            {/* Reason Badge */}
                            {course.reason && (
                                <div className="absolute -top-3 left-4 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full shadow-sm">
                                    {course.reason}
                                </div>
                            )}
                            <CourseCard course={course} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
