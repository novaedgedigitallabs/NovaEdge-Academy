"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { courseService, enrollmentService, progressService } from "@/services/api";
import Navbar from "@/components/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";

export default function CoursePlayerPage() {
    const { id } = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [activeLecture, setActiveLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolled, setEnrolled] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                // 1. Check enrollment
                const enrollmentData = await enrollmentService.checkEnrollment(id);
                if (!enrollmentData.enrolled) {
                    // Redirect if not enrolled (or show locked state)
                    // For now, let's redirect to course details or listing
                    router.push("/courses");
                    return;
                }
                setEnrolled(true);

                // 2. Fetch course details
                const courseData = await courseService.getCourseDetails(id);
                setCourse(courseData);

                // Set first lecture as active if available
                if (courseData.modules?.[0]?.lectures?.[0]) {
                    setActiveLecture(courseData.modules[0].lectures[0]);
                }
            } catch (error) {
                console.error("Error initializing course player", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) init();
    }, [id, router]);

    const handleMarkComplete = async () => {
        if (!activeLecture) return;
        try {
            await progressService.markLectureComplete({
                courseId: id,
                lectureId: activeLecture._id,
            });
            // Ideally update local state to show checkmark
            alert("Lecture marked as complete!");
        } catch (error) {
            console.error("Failed to mark complete", error);
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
    if (!course) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Course not found</div>;

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-full md:w-80 bg-gray-900 border-r border-gray-800 overflow-y-auto">
                    <div className="p-4 border-b border-gray-800">
                        <h2 className="font-bold text-lg truncate">{course.title}</h2>
                        <p className="text-sm text-gray-400">Course Content</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                        {course.modules?.map((module, index) => (
                            <AccordionItem key={module._id || index} value={`item-${index}`}>
                                <AccordionTrigger className="px-4 py-3 hover:bg-gray-800/50 hover:no-underline">
                                    <span className="text-left font-medium">{module.title}</span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-0 pb-0">
                                    <div className="flex flex-col">
                                        {module.lectures?.map((lecture) => (
                                            <button
                                                key={lecture._id}
                                                onClick={() => setActiveLecture(lecture)}
                                                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2 ${activeLecture?._id === lecture._id
                                                        ? "bg-blue-900/20 border-blue-500 text-blue-400"
                                                        : "border-transparent hover:bg-gray-800 text-gray-400"
                                                    }`}
                                            >
                                                {activeLecture?._id === lecture._id ? (
                                                    <PlayCircle className="w-4 h-4" />
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border border-gray-600" />
                                                )}
                                                <span className="truncate">{lecture.title}</span>
                                            </button>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col bg-black overflow-y-auto">
                    {activeLecture ? (
                        <div className="p-6 max-w-5xl mx-auto w-full">
                            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden border border-gray-800 mb-6 relative group">
                                {/* Video Player Placeholder */}
                                <video
                                    src={activeLecture.videoUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                    poster={course.thumbnail}
                                >
                                    Your browser does not support the video tag.
                                </video>
                            </div>

                            <div className="flex items-start justify-between gap-4 mb-6">
                                <div>
                                    <h1 className="text-2xl font-bold mb-2">{activeLecture.title}</h1>
                                    <p className="text-gray-400">{course.title}</p>
                                </div>
                                <Button onClick={handleMarkComplete} className="bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Mark as Complete
                                </Button>
                            </div>

                            <Separator className="bg-gray-800 my-6" />

                            <div className="prose prose-invert max-w-none">
                                <h3>Description</h3>
                                <p>{activeLecture.description || "No description available for this lecture."}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Select a lecture to start learning
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
