"use client";

import { useEffect, useState } from "react";
import { uploadLecture } from "@/services/mentor";
import { getCourseDetails } from "@/services/api"; // Reuse existing public API to get course details including lectures
import { useParams } from "next/navigation";
import { Plus, Play, FileText, Loader2 } from "lucide-react";

export default function MentorLecturesPage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchCourse = async () => {
        try {
            const data = await getCourseDetails(courseId);
            setCourse(data.course);
        } catch (error) {
            console.error("Failed to fetch course", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) fetchCourse();
    }, [courseId]);

    const handleUpload = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await uploadLecture(courseId, {
                title,
                description,
                videoUrl,
                // In a real app, we'd handle file upload to Cloudinary here first
                // For now, we assume the user pastes a URL
            });
            setShowUploadForm(false);
            setTitle("");
            setDescription("");
            setVideoUrl("");
            fetchCourse(); // Refresh list
        } catch (error) {
            alert(error.response?.data?.message || "Upload failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-white">Loading lectures...</div>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Lectures</h1>
                    <p className="text-zinc-400 mt-2">Manage video content for <span className="text-white font-medium">{course?.title}</span></p>
                </div>
                <button
                    onClick={() => setShowUploadForm(!showUploadForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium"
                >
                    <Plus className="h-5 w-5" />
                    Add Lecture
                </button>
            </div>

            {showUploadForm && (
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-lg font-bold text-white mb-4">Upload New Lecture</h3>
                    <form onSubmit={handleUpload} className="space-y-4 max-w-2xl">
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
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Video URL</label>
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                            <p className="text-xs text-zinc-500 mt-1">Direct video link or YouTube URL</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowUploadForm(false)}
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
                                {submitting ? "Uploading..." : "Upload Lecture"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {course?.lectures?.map((lecture, index) => (
                    <div key={lecture._id} className="bg-zinc-900 border border-white/10 rounded-lg p-4 flex items-center justify-between group hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="font-medium text-white">{lecture.title}</h4>
                                <p className="text-sm text-zinc-500 line-clamp-1">{lecture.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">v{lecture.currentVersion}</span>
                            <button className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                <FileText className="h-4 w-4" />
                            </button>
                            <a href={lecture.video.url} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                                <Play className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                ))}
                {course?.lectures?.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        No lectures uploaded yet.
                    </div>
                )}
            </div>
        </div>
    );
}
