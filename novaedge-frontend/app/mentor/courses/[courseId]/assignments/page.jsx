"use client";

import { useEffect, useState } from "react";
import { createAssignment, getCourseAssignments } from "@/services/mentor";
import { useParams } from "next/navigation";
import { Plus, Calendar, FileCheck, Loader2 } from "lucide-react";

export default function MentorAssignmentsPage() {
    const { courseId } = useParams();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [maxMarks, setMaxMarks] = useState(100);
    const [submitting, setSubmitting] = useState(false);

    const fetchAssignments = async () => {
        try {
            const data = await getCourseAssignments(courseId);
            setAssignments(data.assignments);
        } catch (error) {
            console.error("Failed to fetch assignments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) fetchAssignments();
    }, [courseId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createAssignment(courseId, {
                title,
                description,
                dueDate,
                maxMarks: Number(maxMarks),
            });
            setShowCreateForm(false);
            setTitle("");
            setDescription("");
            setDueDate("");
            setMaxMarks(100);
            fetchAssignments();
        } catch (error) {
            alert(error.response?.data?.message || "Creation failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-white">Loading assignments...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Assignments</h1>
                    <p className="text-zinc-400 mt-2">Create and manage assignments for this course.</p>
                </div>
                <button
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Create Assignment
                </button>
            </div>

            {showCreateForm && (
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-white mb-4">New Assignment</h3>
                    <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Due Date</label>
                                <input
                                    type="datetime-local"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Max Marks</label>
                                <input
                                    type="number"
                                    value={maxMarks}
                                    onChange={(e) => setMaxMarks(e.target.value)}
                                    className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="px-4 py-2 text-zinc-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {submitting ? "Creating..." : "Create Assignment"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {assignments.map((assignment) => (
                    <div key={assignment._id} className="bg-zinc-900 border border-white/10 rounded-lg p-4 flex items-center justify-between group hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-blue-400">
                                <FileCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{assignment.title}</h4>
                                <div className="flex items-center gap-4 text-xs text-zinc-500 mt-1">
                                    {assignment.dueDate && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                    )}
                                    <span>Max Marks: {assignment.maxMarks}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-3 py-1.5 text-xs font-medium bg-zinc-800 text-zinc-300 rounded hover:bg-zinc-700 transition-colors">
                                View Submissions
                            </button>
                        </div>
                    </div>
                ))}
                {assignments.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        No assignments created yet.
                    </div>
                )}
            </div>
        </div>
    );
}
