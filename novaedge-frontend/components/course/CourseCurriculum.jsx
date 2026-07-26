"use client";

import { CheckCircle2, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CourseCurriculum({ lectures = [], currentLectureId, courseId, progress }) {
    const totalCount = lectures.length;
    const completedCount = progress?.completedLectures?.length || 
        progress?.lectureProgress?.filter(lp => lp.completed)?.length || 0;
    const percentComplete = progress?.percentComplete ?? 
        (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

    return (
        <div className="flex flex-col gap-4 border border-border rounded-2xl p-4 bg-card shadow-sm">
            <div>
                <h3 className="text-lg font-bold mb-1">Course Content</h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>{completedCount} / {totalCount} Lessons ({percentComplete}%)</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 rounded-full"
                        style={{ width: `${percentComplete}%` }}
                    />
                </div>
            </div>

            <div className="divide-y divide-border border border-border rounded-xl overflow-hidden bg-background">
                {lectures.map((lec, idx) => {
                    const id = lec._id || lec.id;
                    const isActive = id === currentLectureId;
                    const isCompleted = progress?.completedLectures?.includes(id) ||
                        progress?.lectureProgress?.some(lp => (lp.lectureId === id || lp.lecture === id) && lp.completed);

                    return (
                        <Link
                            key={id || idx}
                            href={`/courses/${courseId}/lecture/${id}`}
                            className={cn(
                                "flex items-center gap-3 p-3 transition-colors hover:bg-muted/50",
                                isActive && "bg-primary/10 hover:bg-primary/15"
                            )}
                        >
                            <div className="flex-shrink-0">
                                {isCompleted ? (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/10" />
                                ) : isActive ? (
                                    <PlayCircle className="h-5 w-5 text-primary fill-primary/10 animate-pulse" />
                                ) : (
                                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                                        {idx + 1}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={cn(
                                    "text-xs sm:text-sm font-medium break-words leading-tight",
                                    isActive ? "text-primary font-bold" : "text-foreground"
                                )}>
                                    {lec.title}
                                </p>
                                {lec.duration > 0 && (
                                    <div className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>{lec.duration} min</span>
                                    </div>
                                )}
                            </div>
                            {isCompleted && (
                                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex-shrink-0">
                                    Done
                                </span>
                            )}
                        </Link>
                    );
                })}
                {lectures.length === 0 && (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                        No lectures available.
                    </div>
                )}
            </div>
        </div>
    );
}
