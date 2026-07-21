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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 bg-white">{error}</div>;
    if (!currentLecture) return null;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-8 max-w-[1400px]">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Main Content: Video Player & Tabs */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
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
                            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                                {currentIndex + 1}. {currentLecture.title}
                            </h1>

                            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                        <AvatarImage src="/instructor-avatar.jpg" />
                                        <AvatarFallback>AS</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900">Dr. Anya Sharma</p>
                                        <p className="text-xs text-gray-500 font-medium">Senior Frontend Engineer at Vercel · <span className="text-yellow-500 flex items-center gap-1 inline-flex"><Star className="h-3 w-3 fill-current" /> 4.9</span></p>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-full h-8 text-xs font-bold ml-2 border-blue-100 text-blue-600 hover:bg-blue-50">Follow</Button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full h-10 w-10 p-0"
                                        disabled={!prevLecture}
                                        onClick={() => router.push(`/courses/${courseId}/lecture/${prevLecture._id || prevLecture.id}`)}
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="rounded-full h-10 w-10 p-0"
                                        disabled={!nextLecture}
                                        onClick={() => router.push(`/courses/${courseId}/lecture/${nextLecture._id || nextLecture.id}`)}
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>
                                </div>
                            </div>

                            <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                                <TabsList className="bg-transparent border-b border-gray-100 w-full justify-start rounded-none h-auto p-0 gap-8">
                                    <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 font-bold text-gray-500 data-[state=active]:text-blue-600 transition-all">Overview</TabsTrigger>
                                    <TabsTrigger value="qa" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 font-bold text-gray-500 data-[state=active]:text-blue-600 transition-all">Q&A</TabsTrigger>
                                    <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-4 font-bold text-gray-500 data-[state=active]:text-blue-600 transition-all">Resources</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="py-6 animate-in fade-in duration-300">
                                    <div className="prose prose-blue max-w-none">
                                        <p className="text-gray-600 leading-relaxed">
                                            {currentLecture.description || "In this introductory lesson, we'll explore the fundamental concepts of Next.js 15, focusing on the new App Router and the power of React Server Components. Understand the benefits of server-side rendering and how to structure your projects for maximum performance and scalability."}
                                        </p>
                                        <div className="mt-6 space-y-4">
                                            <h4 className="font-bold text-gray-900">Key takeaways:</h4>
                                            <ul className="grid md:grid-cols-2 gap-3 list-none p-0">
                                                {[
                                                    "Introduction to Next.js 15 & Server Components",
                                                    "Understanding the App Router Directory Structure",
                                                    "Creating Your First Server Component",
                                                    "Client vs Server Components: When to use what"
                                                ].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="qa" className="py-6 animate-in fade-in duration-300">
                                    <LectureDiscussionPanel courseId={courseId} lectureId={lectureId} />
                                </TabsContent>
                                <TabsContent value="resources" className="py-6 animate-in fade-in duration-300">
                                    <div className="grid gap-4">
                                        {[
                                            { name: "Next.js 15 Cheat Sheet.pdf", size: "1.2 MB", type: "PDF" },
                                            { name: "Source Code - Module 1.zip", size: "4.5 MB", type: "ZIP" }
                                        ].map((file, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:bg-gray-50 transition-colors cursor-pointer group">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <BookOpen className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">{file.name}</p>
                                                        <p className="text-xs text-gray-500 font-medium">{file.size} · {file.type}</p>
                                                    </div>
                                                </div>
                                                <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0">
                                                    <Download className="h-5 w-5 text-gray-400" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
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
