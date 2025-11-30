"use client";

import { useState, useEffect } from "react";
import { apiGet } from "@/lib/api";
import { adminGenerateCertificate } from "@/services/certificate";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AdminCertificatesPage() {
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [selectedUser, setSelectedUser] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Users (Assuming admin/users endpoint exists and returns array or { users: [] })
                const usersRes = await apiGet("/api/v1/admin/users");
                const usersData = usersRes.users || usersRes;
                setUsers(Array.isArray(usersData) ? usersData : []);

                // Fetch Courses
                const coursesRes = await apiGet("/api/v1/courses");
                const coursesData = coursesRes.courses || coursesRes.data || coursesRes;
                setCourses(Array.isArray(coursesData) ? coursesData : []);
            } catch (error) {
                toast.error("Failed to load data");
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerate = async () => {
        if (!selectedUser || !selectedCourse) {
            toast.error("Please select both user and course");
            return;
        }

        setGenerating(true);
        try {
            await adminGenerateCertificate(selectedUser, selectedCourse);
            toast.success("Certificate generated successfully!");
            setSelectedUser("");
            setSelectedCourse("");
        } catch (error) {
            toast.error(error.message || "Failed to generate certificate");
        } finally {
            setGenerating(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Certificate Management</h2>
                <p className="text-muted-foreground">
                    Manually generate certificates for students.
                </p>
            </div>

            <Card className="max-w-xl">
                <CardHeader>
                    <CardTitle>Generate Certificate</CardTitle>
                    <CardDescription>
                        Select a student and a course to issue a certificate.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="user">Student</Label>
                        <Select value={selectedUser} onValueChange={setSelectedUser}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user._id} value={user._id}>
                                        {user.name} ({user.email})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="course">Course</Label>
                        <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course._id} value={course._id}>
                                        {course.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleGenerate}
                        disabled={generating || !selectedUser || !selectedCourse}
                    >
                        {generating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Certificate
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
