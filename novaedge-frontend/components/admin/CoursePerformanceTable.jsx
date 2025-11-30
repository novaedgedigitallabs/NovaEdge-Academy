"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils"; // Assuming you have a utility for formatting price

export default function CoursePerformanceTable() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiGet("/api/v1/admin/course-performance");
                if (res.success) {
                    setData(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch course performance:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <Card className="mt-8">
            <CardHeader>
                <CardTitle>Course Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Course Name</TableHead>
                            <TableHead className="text-right">Enrolled Students</TableHead>
                            <TableHead className="text-right">Total Revenue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((course) => (
                            <TableRow key={course._id}>
                                <TableCell className="font-medium">{course.title}</TableCell>
                                <TableCell className="text-right">{course.enrollmentCount}</TableCell>
                                <TableCell className="text-right">
                                    {/* Assuming formatPrice handles currency symbol */}
                                    ₹{course.totalRevenue.toLocaleString("en-IN")}
                                </TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                    No courses found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
