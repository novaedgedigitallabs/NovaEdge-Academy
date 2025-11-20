"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, BookOpen } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading stats...</div>;

    // Mock data for chart if API doesn't return it in this format
    const chartData = stats?.enrollmentsOverTime || [
        { name: 'Jan', enrollments: 40 },
        { name: 'Feb', enrollments: 30 },
        { name: 'Mar', enrollments: 20 },
        { name: 'Apr', enrollments: 27 },
        { name: 'May', enrollments: 18 },
        { name: 'Jun', enrollments: 23 },
        { name: 'Jul', enrollments: 34 },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Earnings</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">${stats?.totalEarnings || "0"}</div>
                        <p className="text-xs text-gray-500">+20.1% from last month</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.activeUsers || "0"}</div>
                        <p className="text-xs text-gray-500">+180 new users</p>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{stats?.totalCourses || "0"}</div>
                        <p className="text-xs text-gray-500">+2 new this week</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                    <CardTitle className="text-white">Enrollments Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="enrollments" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
