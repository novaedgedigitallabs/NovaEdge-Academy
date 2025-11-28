"use client";

import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

export default function CourseProgressBar({ percentComplete }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span>Course Progress</span>
                <span>{percentComplete}%</span>
            </div>
            <Progress value={percentComplete} className="h-2" />
            {percentComplete >= 100 && (
                <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
                    <Trophy className="w-4 h-4" />
                    <span>Course Completed!</span>
                </div>
            )}
        </div>
    );
}
