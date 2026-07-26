"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { getCourseProgress } from "@/services/progress";
import { useAuth } from "@/context/auth-context";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageSquare, BookOpen, Download, Star } from "lucide-react";
import Link from "next/link";
import LecturePlayer from "@/components/course/LecturePlayer";
import LectureDiscussionPanel from "@/components/discussion/LectureDiscussionPanel";
import LectureNotes from "@/components/course/LectureNotes";
import ChatWidget from "@/components/course/ChatWidget";
import CourseCurriculum from "@/components/course/CourseCurriculum";
import { generateLectureResources } from "@/services/ai";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Hook to disable right-click and dev tools
function useProtection() {
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        const handleKeyDown = (e) => {
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

    useProtection();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lectures, setLectures] = useState([]);
    const [currentLecture, setCurrentLecture] = useState(null);
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push(`/login?redirect=/courses/${courseId}/lecture/${lectureId}`);
            return;
        }

        const fetchData = async () => {
            try {
                const check = await apiGet(`/api/v1/enrollment/check/${courseId}`);
                if (!check.accessGranted) {
                    router.push(`/courses/${courseId}`);
                    return;
                }

                // Fetch Course info
                try {
                    const cData = await apiGet(`/api/v1/course/${courseId}`);
                    setCourse(cData.course || cData);
                } catch (e) {
                    console.error("Course fetch failed", e);
                }

                const data = await apiGet(`/api/v1/course/${courseId}/lectures`);
                const allLectures = data.lectures || [];
                setLectures(allLectures);

                const current = allLectures.find(l => (l._id || l.id) === lectureId);
                if (current) {
                    setCurrentLecture(current);
                } else {
                    setError("Lecture not found");
                }

                const progressData = await getCourseProgress(courseId);
                setProgress(progressData.progress);
            } catch (err) {
                setError(err.message || "Failed to load lecture");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [courseId, lectureId, user, authLoading, router]);

    const currentIndex = lectures.findIndex(l => (l._id || l.id) === lectureId);
    const prevLecture = currentIndex > 0 ? lectures[currentIndex - 1] : null;
    const nextLecture = currentIndex < lectures.length - 1 ? lectures[currentIndex + 1] : null;

    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const handleGenerateAI = async () => {
        setIsGeneratingAI(true);
        try {
            const data = await generateLectureResources(courseId, lectureId);
            if (data.success) {
                setCurrentLecture(prev => ({
                    ...prev,
                    aiSummary: data.aiSummary,
                    quiz: data.quiz
                }));
                toast.success("AI resources generated successfully!");
            }
        } catch (err) {
            toast.error("Failed to generate AI resources");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-destructive bg-background">{error}</div>;
    if (!currentLecture) return null;

    const instructorName = course?.createdBy || "NovaEdge Instructor";

    return (
        <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-[1400px]">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content: Video Player & Tabs */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border">
                            <LecturePlayer
                                courseId={courseId}
                                lectureId={lectureId}
                                videoUrl={currentLecture.video?.url}
                                initialPosition={0}
                                onComplete={() => {
                                    getCourseProgress(courseId).then(data => setProgress(data.progress));
                                }}
                                aiSummary={currentLecture.aiSummary}
                                quiz={currentLecture.quiz}
                                onGenerateAI={handleGenerateAI}
                                isGeneratingAI={isGeneratingAI}
                                minimalist={true}
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight break-words">
                                {currentIndex + 1}. {currentLecture.title}
                            </h1>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <Avatar className="h-10 w-10 flex-shrink-0 border border-border shadow-sm">
                                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                            {instructorName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                        <p className="font-bold text-sm truncate">{instructorName}</p>
                                        <p className="text-xs text-muted-foreground font-medium truncate">Course Instructor</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full h-9 w-9 p-0"
                                        disabled={!prevLecture}
                                        onClick={() => router.push(`/courses/${courseId}/lecture/${prevLecture._id || prevLecture.id}`)}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full h-9 w-9 p-0"
                                        disabled={!nextLecture}
                                        onClick={() => router.push(`/courses/${courseId}/lecture/${nextLecture._id || nextLecture.id}`)}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                                <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-6">
                                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-3 font-semibold text-muted-foreground data-[state=active]:text-primary transition-all">Overview</TabsTrigger>
                                    <TabsTrigger value="qa" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-3 font-semibold text-muted-foreground data-[state=active]:text-primary transition-all">Q&A</TabsTrigger>
                                    <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-1 pb-3 font-semibold text-muted-foreground data-[state=active]:text-primary transition-all">Resources</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="py-6 animate-in fade-in duration-300">
                                    <div className="max-w-none overflow-hidden space-y-6">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2">About this lecture</h4>
                                            <p className="text-muted-foreground leading-relaxed break-words whitespace-pre-wrap" style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
                                                {currentLecture.description || "No specific description provided for this lecture."}
                                            </p>
                                        </div>

                                        {currentLecture.aiSummary && (
                                            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                                                <h4 className="font-bold text-sm text-primary mb-1">AI Generated Summary</h4>
                                                <p className="text-sm leading-relaxed">{currentLecture.aiSummary}</p>
                                            </div>
                                        )}

                                        {course?.outcomes && course.outcomes.length > 0 && (
                                            <div className="space-y-3">
                                                <h4 className="font-bold text-base">What you learn in this course:</h4>
                                                <ul className="grid sm:grid-cols-2 gap-2">
                                                    {course.outcomes.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                                                            <span className="text-emerald-500 font-bold">✓</span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="qa" className="py-6 animate-in fade-in duration-300">
                                    <LectureDiscussionPanel courseId={courseId} lectureId={lectureId} />
                                </TabsContent>
                                <TabsContent value="resources" className="py-6 animate-in fade-in duration-300">
                                    {currentLecture.notes?.url ? (
                                        <div className="grid gap-4">
                                            <a
                                                href={currentLecture.notes.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm group-hover:text-primary transition-colors">Lecture Notes / Materials</p>
                                                        <p className="text-xs text-muted-foreground font-medium">Downloadable Resource</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                                                    <Download className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-muted-foreground text-sm border border-dashed rounded-xl p-6">
                                            No additional downloadable resources attached to this lecture.
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar: Course Curriculum */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <CourseCurriculum
                                lectures={lectures}
                                currentLectureId={lectureId}
                                courseId={courseId}
                                progress={progress}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <ChatWidget courseId={courseId} lectureId={lectureId} />
        </div>
    );
}
