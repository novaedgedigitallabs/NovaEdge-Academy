"use client";

import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function TranscriptPanel({ segments, currentTime, onSeek }) {
    const activeRef = useRef(null);
    const scrollRef = useRef(null);

    // Auto-scroll to active segment
    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [currentTime]);

    if (!segments || segments.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground text-sm">
                No transcript available for this lecture.
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col border rounded-xl bg-card">
            <div className="p-3 border-b font-semibold text-sm bg-muted/30">
                Transcript
            </div>
            <ScrollArea className="flex-grow h-[300px] lg:h-[400px] p-4" ref={scrollRef}>
                <div className="space-y-4">
                    {segments.map((seg, idx) => {
                        const isActive = currentTime >= seg.start && currentTime < seg.end;
                        return (
                            <div
                                key={idx}
                                ref={isActive ? activeRef : null}
                                onClick={() => onSeek(seg.start)}
                                className={cn(
                                    "cursor-pointer p-2 rounded transition-colors text-sm leading-relaxed hover:bg-muted",
                                    isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                                )}
                            >
                                <span className="text-xs opacity-50 mr-2 font-mono">
                                    {formatTime(seg.start)}
                                </span>
                                {seg.text}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
