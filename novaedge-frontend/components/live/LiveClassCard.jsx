"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video } from "lucide-react";

export default function LiveClassCard({ liveClass, isEnrolled }) {
    const startTime = new Date(liveClass.startTime);
    const endTime = new Date(liveClass.endTime);
    const now = new Date();

    const isLive = now >= startTime && now <= endTime && liveClass.status !== "cancelled";
    const isCompleted = liveClass.status === "completed" || (now > endTime && liveClass.status !== "cancelled");
    const isCancelled = liveClass.status === "cancelled";

    return (
        <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{liveClass.title}</CardTitle>
                    {isLive && <Badge className="bg-red-500 animate-pulse">LIVE NOW</Badge>}
                    {isCompleted && <Badge variant="secondary">Completed</Badge>}
                    {isCancelled && <Badge variant="destructive">Cancelled</Badge>}
                    {!isLive && !isCompleted && !isCancelled && <Badge variant="outline">Upcoming</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{liveClass.description}</p>
            </CardHeader>
            <CardContent className="pb-2 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{startTime.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                        {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="pt-2">
                {isLive && isEnrolled && (
                    <Button className="w-full" onClick={() => window.open(liveClass.meetingLink, "_blank")}>
                        <Video className="w-4 h-4 mr-2" /> Join Class
                    </Button>
                )}
                {isCompleted && liveClass.recordingUrl && (
                    <Button variant="outline" className="w-full" onClick={() => window.open(liveClass.recordingUrl, "_blank")}>
                        Watch Recording
                    </Button>
                )}
                {!isLive && !isCompleted && !isCancelled && (
                    <Button variant="secondary" className="w-full" disabled>
                        Starts in {Math.ceil((startTime - now) / (1000 * 60 * 60))} hours
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
