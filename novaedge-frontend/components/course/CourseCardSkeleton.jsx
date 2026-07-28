"use client";

export default function CourseCardSkeleton() {
    return (
        <div className="rounded-2xl border border-border/50 bg-card overflow-hidden flex flex-col shadow-sm relative group animate-pulse">
            {/* Thumbnail Shimmer */}
            <div className="w-full h-48 bg-white/10 relative overflow-hidden shrink-0">
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
                    style={{ animation: "shimmer 2s infinite" }} 
                />
            </div>

            {/* Content Shimmers */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                    {/* Badge Skeleton */}
                    <div className="flex items-center gap-2">
                        <div className="h-4 w-24 rounded-full bg-white/10" />
                        <div className="h-4 w-16 rounded-full bg-white/5" />
                    </div>

                    {/* Title Skeleton */}
                    <div className="h-5 w-full rounded-md bg-white/10" />
                    <div className="h-5 w-3/4 rounded-md bg-white/5" />

                    {/* Subtitle / Instructor */}
                    <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-white/10 shrink-0" />
                        <div className="h-3.5 w-28 rounded bg-white/5" />
                    </div>
                </div>

                {/* Footer Skeleton */}
                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                    <div className="h-5 w-20 rounded bg-white/10" />
                    <div className="h-9 w-24 rounded-full bg-primary/25" />
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
