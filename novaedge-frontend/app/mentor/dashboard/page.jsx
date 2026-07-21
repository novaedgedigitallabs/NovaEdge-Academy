"use client";

import { useEffect, useState } from "react";
import { getMentorAnalytics, getMentorProfile } from "@/services/mentor";
import Link from "next/link";
import { BookOpen, Users, Clock, MessageCircle, ArrowRight } from "lucide-react";

export default function MentorDashboard() {
    const [analytics, setAnalytics] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsData, profileData] = await Promise.all([
                    getMentorAnalytics(),
                    getMentorProfile(),
                ]);
                setAnalytics(analyticsData.analytics);
                setCourses(profileData.assignedCourses);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-white">Loading dashboard...</div>;
    }

    const stats = [
        {
            label: "Assigned Courses",
            value: analytics?.totalCourses || 0,
            icon: BookOpen,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Total Students",
            value: analytics?.totalStudents || 0,
            icon: Users,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            label: "Pending Submissions",
            value: analytics?.pendingSubmissions || 0,
            icon: Clock,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
        },
        {
            label: "Active Questions",
            value: analytics?.activeQuestions || 0,
            icon: MessageCircle,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Mentor Dashboard</h1>
                <p className="text-zinc-400 mt-2">Welcome back! Here's what's happening in your courses.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-zinc-900 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-zinc-400 font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Courses */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Your Courses</h2>
                    <Link href="/mentor/courses" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 3).map((course) => (
                        <div key={course._id} className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-colors group">
                            <div className="aspect-video relative bg-zinc-800">
                                {course.poster?.url ? (
                                    <img src={course.poster.url} alt={course.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Link
                                        href={`/mentor/courses/${course._id}/lectures`}
                                        className="px-4 py-2 bg-white text-black rounded-full font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform"
                                    >
                                        Manage Course
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-white truncate">{course.title}</h3>
                                <div className="flex items-center justify-between mt-4 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {course.numOfVideos} Lectures</span>
                                    <span>{course.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-zinc-900/50 border border-white/5 rounded-xl border-dashed">
                            <p className="text-zinc-500">You haven't been assigned to any courses yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
