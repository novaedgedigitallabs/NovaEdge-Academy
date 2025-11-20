"use client";

import { useEffect, useState } from "react";
import { enrollmentService } from "@/services/api";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export default function DashboardPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const data = await enrollmentService.getMyEnrollments();
                // Adjust based on API response structure
                const list = Array.isArray(data) ? data : (data.data || data.enrollments || []);
                setEnrollments(list);
            } catch (error) {
                console.error("Failed to fetch enrollments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />

            <main className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">My Learning Dashboard</h1>

                {loading ? (
                    <div className="text-gray-400">Loading your progress...</div>
                ) : enrollments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
                        <h2 className="text-xl font-semibold mb-4">You haven't enrolled in any courses yet.</h2>
                        <Link href="/courses">
                            <Button className="bg-blue-600 hover:bg-blue-700">Browse Courses</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {enrollments.map((enrollment) => {
                            // Assuming enrollment object has course details populated
                            // enrollment.course = { title, thumbnail, ... }
                            // enrollment.progress = number (0-100)
                            const course = enrollment.course || {};
                            const progress = enrollment.progress || 0;

                            return (
                                <Card key={enrollment._id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                                        <div className="w-full sm:w-48 aspect-video bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                                            {course.thumbnail ? (
                                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No Image</div>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <CardTitle className="text-lg text-white mb-2 line-clamp-1">
                                                    {course.title || "Untitled Course"}
                                                </CardTitle>
                                                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                                    <span>Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <Progress value={progress} className="h-2 bg-gray-800" indicatorClassName="bg-blue-500" />
                                            </div>

                                            <div className="mt-4">
                                                <Link href={`/course/${course._id}/learn`}>
                                                    <Button className="w-full sm:w-auto bg-white text-black hover:bg-gray-200">
                                                        <PlayCircle className="w-4 h-4 mr-2" />
                                                        Continue Learning
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
