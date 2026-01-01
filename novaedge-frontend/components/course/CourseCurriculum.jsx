"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Lock, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CourseCurriculum({ lectures, currentLectureId, courseId, progress }) {
    // Group lectures into modules (mock grouping if not provided by backend)
    // In a real app, the backend should return modules. 
    // For now, we'll group them into "Module 1", "Module 2", etc.
    const modules = [
        {
            title: "Module 1: Foundation",
            lectures: lectures.slice(0, 3),
            progress: "3/3 Lessons Completed (100%)"
        },
        {
            title: "Module 2: Routing & Navigation",
            lectures: lectures.slice(3, 6),
            progress: "1/3 Lessons Completed (33%)"
        },
        {
            title: "Module 3: Data Fetching Strategies",
            lectures: lectures.slice(6),
            progress: "0/2 Lessons Completed (0%)"
        }
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="px-1">
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Course Curriculum</h3>
                <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                    <span>{Math.round(progress?.percentage || 20)}% Complete</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500"
                        style={{ width: `${progress?.percentage || 20}%` }}
                    />
                </div>
            </div>

            <div className="space-y-3">
                {modules.map((module, idx) => (
                    <ModuleItem
                        key={idx}
                        module={module}
                        currentLectureId={currentLectureId}
                        courseId={courseId}
                        progress={progress}
                    />
                ))}
            </div>
        </div>
    );
}

function ModuleItem({ module, currentLectureId, courseId, progress }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
            >
                <div>
                    <h4 className="font-bold text-gray-900 text-sm">{module.title}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{module.progress}</p>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>

            {isOpen && (
                <div className="border-t border-gray-50">
                    {module.lectures.map((lec, idx) => {
                        const id = lec._id || lec.id;
                        const isActive = id === currentLectureId;
                        const isCompleted = progress?.lectureProgress?.find(lp => lp.lectureId === id && lp.completed);
                        const isLocked = !isCompleted && !isActive && idx > 0; // Simple mock logic for locked

                        return (
                            <Link
                                key={id}
                                href={`/courses/${courseId}/lecture/${id}`}
                                className={cn(
                                    "flex items-center gap-3 p-4 transition-colors border-b border-gray-50 last:border-0",
                                    isActive ? "bg-blue-50/50" : "hover:bg-gray-50",
                                    isLocked && "opacity-60 pointer-events-none"
                                )}
                            >
                                <div className="flex-shrink-0">
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500 fill-green-50" />
                                    ) : isActive ? (
                                        <PlayCircle className="h-5 w-5 text-blue-600 fill-blue-50" />
                                    ) : isLocked ? (
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border-2 border-gray-200" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-medium line-clamp-1",
                                        isActive ? "text-blue-700 font-bold" : "text-gray-700"
                                    )}>
                                        {idx + 1}. {lec.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Clock className="h-3 w-3 text-gray-400" />
                                        <span className="text-[10px] text-gray-500 font-medium">{lec.duration || "12:35"}</span>
                                    </div>
                                </div>
                                {isCompleted && (
                                    <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                        Completed
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
