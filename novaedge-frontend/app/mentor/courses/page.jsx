"use client";

import { useEffect, useState } from "react";
import { getMentorProfile } from "@/services/mentor";
import Link from "next/link";
import { Users, Video, FileText } from "lucide-react";

export default function MentorCoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getMentorProfile();
                setCourses(data.assignedCourses);
            } catch (error) {
                console.error("Failed to fetch courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) return <div className="text-white">Loading courses...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">My Courses</h1>
                <p className="text-zinc-400 mt-2">Manage content and students for your assigned courses.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {courses.map((course) => (
                    <div key={course._id} className="bg-zinc-900 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-full md:w-48 aspect-video rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                            {course.poster?.url ? (
                                <img src={course.poster.url} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                            <p className="text-zinc-400 line-clamp-2 mb-4">{course.description}</p>

                            <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                                <div className="flex items-center gap-1">
                                    <Video className="h-4 w-4" />
                                    <span>{course.numOfVideos} Lectures</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>{course.views} Views</span>
                                </div>
                                <div className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
                                    {course.category}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full md:w-auto flex-shrink-0">
                            <Link
                                href={`/mentor/courses/${course._id}/lectures`}
                                className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition-colors text-center"
                            >
                                Manage Lectures
                            </Link>
                            <Link
                                href={`/mentor/courses/${course._id}/assignments`}
                                className="px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors text-center border border-white/10"
                            >
                                Assignments
                            </Link>
                            <Link
                                href={`/mentor/courses/${course._id}/students`}
                                className="px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors text-center border border-white/10"
                            >
                                Students
                            </Link>
                        </div>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="text-center py-12 bg-zinc-900/50 border border-white/5 rounded-xl border-dashed">
                        <p className="text-zinc-500">No courses assigned yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
