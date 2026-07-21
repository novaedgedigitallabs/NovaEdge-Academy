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
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AIResourcesPanel from "@/components/course/AIResourcesPanel";

export default function LecturePlayer({
    courseId,
    lectureId,
    videoUrl,
    initialPosition = 0,
    onComplete,
    aiSummary,
    quiz,
    onGenerateAI,
    isGeneratingAI,
    minimalist = false,
}) {
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const lastUpdateRef = useRef(0);

    // Fetch Transcript
    useEffect(() => {
        if (courseId && lectureId) {
            getTranscript(courseId, lectureId).then(res => {
                if (res.transcript) setTranscript(res.transcript.segments);
            });
        }
    }, [courseId, lectureId]);

    const handlePlay = () => {
        setIsPlaying(true);
        recordEvent({ type: "lecture_view", courseId, lectureId });
    };

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handleSpeedChange = (rate) => {
        setPlaybackRate(rate);
        if (videoRef.current) videoRef.current.playbackRate = rate;
        recordEvent({ type: "lecture_speed_change", courseId, lectureId, meta: { rate } });
    };

    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeId(videoUrl);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const curr = videoRef.current.currentTime;
        setCurrentTime(curr);
        const now = Date.now();

        if (now - lastUpdateRef.current > 10000) {
            saveProgress(curr);
            lastUpdateRef.current = now;
            recordEvent({ type: "lecture_progress", courseId, lectureId, meta: { progress: (curr / duration) * 100 } });
        }

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

            if (completed) {
                setIsCompleted(true);
                toast.success("Lecture completed!");
                if (onComplete) onComplete();
            }
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

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
        }
    };

    if (minimalist) {
        return (
            <div className="relative w-full h-full group">
                {youtubeId ? (
                    <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0&controls=1`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                ) : videoUrl ? (
                    <>
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={handlePlay}
                            onPause={handlePause}
                        />
                        {/* Custom Minimalist Controls */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                            <div className="flex items-center gap-4 text-white">
                                <button onClick={togglePlay} className="hover:scale-110 transition-transform">
                                    {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current" />}
                                </button>
                                <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer relative">
                                    <div
                                        className="h-full bg-blue-500"
                                        style={{ width: `${(currentTime / duration) * 100}%` }}
                                    />
                                </div>
                                <div className="text-sm font-bold tabular-nums">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 text-white hover:bg-white/20 font-bold">
                                            {playbackRate}x
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
                                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                            <DropdownMenuItem key={rate} onClick={() => handleSpeedChange(rate)} className="hover:bg-white/20">
                                                {rate}x
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <button onClick={() => videoRef.current?.requestFullscreen()} className="hover:scale-110 transition-transform">
                                    <Maximize className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-white bg-gray-900">
                        <p className="font-bold">Video source not available</p>
                    </div>
                )}
            </div>
        );
    }

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

                <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Switch tabs below for Transcript & AI
                    </div>
                    <button
                        onClick={() => saveProgress(duration, true)}
                        className="text-sm text-primary underline"
                    >
                        Mark as Completed
                    </button>
                </div>

                <div className="h-[500px] border rounded-xl bg-card overflow-hidden">
                    <Tabs defaultValue="transcript" className="h-full flex flex-col">
                        <div className="p-3 border-b bg-muted/30">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="transcript" className="flex-1 min-h-0 p-0 m-0 h-full">
                            <TranscriptPanel
                                segments={transcript}
                                currentTime={currentTime}
                                onSeek={handleSeek}
                            />
                        </TabsContent>
                        <TabsContent value="ai" className="flex-1 min-h-0 p-0 m-0 h-full overflow-y-auto">
                            <AIResourcesPanel
                                summary={aiSummary}
                                quiz={quiz}
                                onGenerate={onGenerateAI}
                                isGenerating={isGeneratingAI}
                            />
                        </TabsContent>
                    </Tabs>
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

            <div className="lg:col-span-1 h-[600px] border rounded-xl bg-card overflow-hidden">
                <Tabs defaultValue="transcript" className="h-full flex flex-col">
                    <div className="p-3 border-b bg-muted/30">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="transcript">Transcript</TabsTrigger>
                            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="transcript" className="flex-1 min-h-0 p-0 m-0 h-full">
                        <TranscriptPanel
                            segments={transcript}
                            currentTime={currentTime}
                            onSeek={handleSeek}
                        />
                    </TabsContent>
                    <TabsContent value="ai" className="flex-1 min-h-0 p-0 m-0 h-full overflow-y-auto">
                        <AIResourcesPanel
                            summary={aiSummary}
                            quiz={quiz}
                            onGenerate={onGenerateAI}
                            isGenerating={isGeneratingAI}
                        />
                    </TabsContent>
                </Tabs>
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
