"use client";

import { useEffect, useRef, useState } from "react";
import { updateLectureProgress } from "@/services/progress";
import { getTranscript } from "@/services/transcript";
import { recordEvent } from "@/services/analytics";
import TranscriptPanel from "@/components/course/TranscriptPanel";
import { Button } from "@/components/ui/button";
import { Settings, Maximize, Play, Pause, Volume2, VolumeX } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function LecturePlayer({
    courseId,
    lectureId,
    videoUrl,
    initialPosition = 0,
    onComplete,
}) {
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [playbackRate, setPlaybackRate] = useState(1);
    const lastUpdateRef = useRef(0);

    // Fetch Transcript
    useEffect(() => {
        if (courseId && lectureId) {
            getTranscript(courseId, lectureId).then(res => {
                if (res.transcript) setTranscript(res.transcript.segments);
            });
        }
    }, [courseId, lectureId]);

    // Analytics: Play
    const handlePlay = () => {
        recordEvent({ type: "lecture_view", courseId, lectureId });
    };

    // Analytics: Speed Change
    const handleSpeedChange = (rate) => {
        setPlaybackRate(rate);
        if (videoRef.current) videoRef.current.playbackRate = rate;
        recordEvent({ type: "lecture_speed_change", courseId, lectureId, meta: { rate } });
    };

    // Helper to extract YouTube ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeId(videoUrl);

    // --- NATIVE VIDEO HANDLERS ---
    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const curr = videoRef.current.currentTime;
        setCurrentTime(curr);
        const now = Date.now();

        // Debounce updates (every 10s)
        if (now - lastUpdateRef.current > 10000) {
            saveProgress(curr);
            lastUpdateRef.current = now;
            recordEvent({ type: "lecture_progress", courseId, lectureId, meta: { progress: (curr / duration) * 100 } });
        }

        // Check completion (90%)
        if (!isCompleted && duration > 0 && curr / duration >= 0.9) {
            setIsCompleted(true);
            saveProgress(curr, true);
            if (onComplete) onComplete();
            recordEvent({ type: "lecture_complete", courseId, lectureId });
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
            if (initialPosition > 0) {
                videoRef.current.currentTime = initialPosition;
            }
        }
    };

    const saveProgress = async (curr, completed = false) => {
        try {
            await updateLectureProgress(courseId, lectureId, {
                lastPositionSec: curr,
                watchedDurationSec: curr,
                completed: completed || isCompleted,
            });
        } catch (err) {
            console.error("Failed to save progress", err);
        }
    };

    const handleSeek = (time) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            recordEvent({ type: "lecture_seek", courseId, lectureId, meta: { time } });
        }
    };

    if (youtubeId) {
        return (
            <div className="space-y-4">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0&controls=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                {/* YouTube doesn't support our custom transcript sync easily without API */}
                <div className="flex justify-end">
                    <button
                        onClick={() => saveProgress(duration, true)}
                        className="text-sm text-primary underline"
                    >
                        Mark as Completed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="relative group aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                    {videoUrl ? (
                        <>
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="w-full h-full"
                                onTimeUpdate={handleTimeUpdate}
                                onLoadedMetadata={handleLoadedMetadata}
                                onPlay={handlePlay}
                                controls
                            />
                            {/* Custom Controls Overlay (Optional, sticking to native controls + external speed for reliability) */}
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-white">
                            <p>Video source not available</p>
                        </div>
                    )}
                </div>

                {/* Controls Bar */}
                <div className="flex items-center justify-between bg-muted/20 p-3 rounded-lg border">
                    <div className="text-sm font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 gap-1">
                                    <Settings className="w-4 h-4" /> {playbackRate}x
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                    <DropdownMenuItem key={rate} onClick={() => handleSpeedChange(rate)}>
                                        {rate}x
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1 h-[400px] lg:h-auto">
                <TranscriptPanel
                    segments={transcript}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                />
            </div>
        </div>
    );
}

function formatTime(seconds) {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}
