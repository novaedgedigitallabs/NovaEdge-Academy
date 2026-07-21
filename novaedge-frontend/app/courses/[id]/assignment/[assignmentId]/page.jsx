"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAssignments, submitAssignment } from "@/services/assignment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Header from "@/components/layout/Header";

export default function AssignmentPage() {
    const { id: courseId, assignmentId } = useParams();
    const router = useRouter();

    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);

    const [link, setLink] = useState("");
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAssignments(courseId);
                const found = data.assignments.find(a => a._id === assignmentId);
                setAssignment(found);
            } catch (e) {
                toast.error("Failed to load assignment");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [courseId, assignmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            if (link) formData.append("submissionLink", link);
            if (text) formData.append("textContent", text);
            if (file) formData.append("file", file);

            await submitAssignment(assignmentId, formData);
            toast.success("Assignment submitted successfully!");
            router.push(`/courses/${courseId}`);
        } catch (e) {
            toast.error(e.message || "Submission failed");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!assignment) return <div>Assignment not found</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto py-12 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>{assignment.title}</CardTitle>
                        <p className="text-muted-foreground mt-2">{assignment.description}</p>
                        <div className="text-sm text-muted-foreground mt-1">
                            Max Marks: {assignment.maxMarks} | Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : "No deadline"}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Submission Link (GitHub/Drive)</Label>
                                <Input
                                    placeholder="https://..."
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Text Submission / Notes</Label>
                                <Textarea
                                    placeholder="Write your answer or notes here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rows={5}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>File Upload (Optional)</Label>
                                <Input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Submit Assignment
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
