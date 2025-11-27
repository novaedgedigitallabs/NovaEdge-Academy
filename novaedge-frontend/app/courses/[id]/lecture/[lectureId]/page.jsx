"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";

// Hook to disable right-click and dev tools
function useProtection() {
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        const handleKeyDown = (e) => {
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            if (
                e.key === "F12" ||
                (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
                (e.ctrlKey && e.key === "u")
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener("contextmenu", handleContextMenu);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("contextmenu", handleContextMenu);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
}

export default function LecturePage() {
    const { id: courseId, lectureId } = useParams();
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();

    useProtection(); // Activate protection

    const [loading, setLoading] = useState(true);
    const [lectures, setLectures] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push(`/login?redirect=/courses/${courseId}/lecture/${lectureId}`);
            return;
        }

        const fetchData = async () => {
            try {
                // 1. Check Enrollment
                const check = await apiGet(`/api/v1/enrollment/check/${courseId}`);
                if (!check.accessGranted) {
                    router.push(`/courses/${courseId}`); // Redirect to sales page if not enrolled
                    return;
                }

                // 2. Fetch Lectures
                const data = await apiGet(`/api/v1/course/${courseId}/lectures`);
                const allLectures = data.lectures || [];
                setLectures(allLectures);

                // 3. Find Current Lecture
                const current = allLectures.find(l => (l._id || l.id) === lectureId);
                if (current) {
                    setCurrentLecture(current);
                } else {
                    setError("Lecture not found");
                }
            } catch (err) {
                setError(err.message || "Failed to load lecture");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, lectureId, user, authLoading, router]);

    // Navigation helpers
    const currentIndex = lectures.findIndex(l => (l._id || l.id) === lectureId);
    const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
    const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

    // Helper to extract YouTube ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!currentLecture) return null;

    const youtubeId = getYouTubeId(currentLecture.video?.url);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-6">
                    <Link href={`/courses/${courseId}`} className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm mb-4">
                        <ChevronLeft className="w-4 h-4" /> Back to Course
                    </Link>
                    <h1 className="text-2xl font-bold">{currentLecture.title}</h1>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: Video Player */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                            {youtubeId ? (
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0&controls=1&autoplay=1`}
                                    title={currentLecture.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="flex items-center justify-center h-full text-white">
                                    {currentLecture.video?.url ? (
                                        <video src={currentLecture.video.url} controls className="w-full h-full" />
                                    ) : (
                                        <p>Video source not available</p>
                                    )}
                                </div>
                            )}

                            {/* Overlay to prevent direct interaction if needed, but might block controls */}
                            {/* <div className="absolute inset-0 bg-transparent" onContextMenu={(e) => e.preventDefault()} /> */}
                        </div>

                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                disabled={!prevLecture}
                                onClick={() => router.push(`/courses/${courseId}/lecture/${prevLecture._id || prevLecture.id}`)}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
                            </Button>
                            <Button
                                disabled={!nextLecture}
                                onClick={() => router.push(`/courses/${courseId}/lecture/${nextLecture._id || nextLecture.id}`)}
                            >
                                Next <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>

                        <div className="bg-muted/30 p-6 rounded-xl border">
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground">{currentLecture.description}</p>
                        </div>
                    </div>

                    {/* Sidebar: Playlist */}
                    <div className="lg:col-span-1">
                        <div className="border rounded-xl overflow-hidden sticky top-24 bg-card">
                            <div className="p-4 border-b bg-muted/50 flex items-center justify-between">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <List className="w-4 h-4" /> Course Content
                                </h3>
                                <span className="text-xs text-muted-foreground">{lectures.length} Lectures</span>
                            </div>
                            <div className="max-h-[600px] overflow-y-auto">
                                {lectures.map((lec, idx) => {
                                    const isActive = (lec._id || lec.id) === lectureId;
                                    return (
                                        <Link
                                            key={lec._id || lec.id}
                                            href={`/courses/${courseId}/lecture/${lec._id || lec.id}`}
                                            className={`block p-4 border-b last:border-0 hover:bg-muted/50 transition-colors ${isActive ? "bg-primary/5 border-l-4 border-l-primary" : ""}`}
                                        >
                                            <div className="flex gap-3">
                                                <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                                                    {idx + 1}.
                                                </span>
                                                <div>
                                                    <p className={`text-sm font-medium mb-1 ${isActive ? "text-primary" : ""}`}>
                                                        {lec.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {lec.duration || "10:00"}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
