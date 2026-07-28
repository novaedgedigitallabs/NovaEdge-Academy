"use client";

export default function Loading() {
    return (
        <div className="w-full flex-1 flex flex-col gap-6 p-4 md:p-6 animate-pulse">
            {/* Header Title Skeleton */}
            <div className="flex flex-col gap-2">
                <div className="h-7 w-48 rounded-lg bg-white/10" />
                <div className="h-4 w-72 rounded bg-white/5" />
            </div>

            {/* Top Banner / Hero Skeleton */}
            <div className="w-full h-44 rounded-2xl bg-white/10 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" 
                    style={{ animation: "shimmer 2s infinite" }} 
                />
            </div>

            {/* Content Items Skeleton Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-2">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-52 rounded-2xl bg-white/5 border border-white/5 p-5 flex flex-col justify-between animate-pulse">
                        <div className="flex flex-col gap-2.5">
                            <div className="h-4 w-24 rounded-full bg-white/10" />
                            <div className="h-5 w-3/4 rounded-md bg-white/10" />
                            <div className="h-4 w-1/2 rounded-md bg-white/5" />
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div className="h-4 w-16 rounded bg-white/10" />
                            <div className="h-8 w-24 rounded-full bg-primary/20" />
                        </div>
                    </div>
                ))}
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
