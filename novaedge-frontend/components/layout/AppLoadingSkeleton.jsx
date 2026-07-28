"use client";

import Image from "next/image";

export default function AppLoadingSkeleton() {
    return (
        <div className="min-h-screen w-full bg-[#07090e] text-foreground flex flex-col justify-between overflow-hidden relative selection:bg-primary">
            {/* Top Glowing Brand Header for Loading State */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#07090e]/80 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-primary/30 blur-md animate-pulse" />
                        <Image
                            src="/icon.png"
                            alt="NovaEdge Academy"
                            width={32}
                            height={32}
                            className="relative z-10 w-8 h-8 object-contain animate-bounce"
                            style={{ animationDuration: "2s" }}
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight text-foreground flex items-center gap-2">
                            NovaEdge <span className="text-primary font-extrabold">Academy</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground animate-pulse">
                            Loading your workspace...
                        </span>
                    </div>
                </div>

                {/* Animated Top Progress Bar */}
                <div className="w-36 h-1.5 rounded-full bg-white/10 overflow-hidden relative">
                    <div className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-primary via-purple-500 to-pink-500 w-full animate-progress-stripes" style={{
                        animation: "progressLoading 1.5s infinite ease-in-out"
                    }} />
                </div>
            </div>

            {/* Skeleton App Shell Structure */}
            <div className="flex min-h-screen w-full pt-16 justify-between max-w-7xl mx-auto px-4 md:px-6">
                {/* Left Sidebar Skeleton (Hidden on Mobile) */}
                <aside className="hidden lg:flex flex-col gap-6 w-64 pt-6 pr-6 border-r border-white/5 shrink-0">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 animate-pulse">
                        <div className="w-5 h-5 rounded-md bg-white/10" />
                        <div className="h-4 w-24 rounded bg-white/10" />
                    </div>

                    <div className="flex flex-col gap-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl animate-pulse">
                                <div className="w-5 h-5 rounded-md bg-white/5" />
                                <div className="h-4 w-28 rounded bg-white/5" />
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-white/10" />
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="h-3.5 w-20 rounded bg-white/10" />
                            <div className="h-2.5 w-14 rounded bg-white/5" />
                        </div>
                    </div>
                </aside>

                {/* Main Middle Feed Skeleton */}
                <main className="flex-1 w-full min-w-0 flex flex-col gap-6 py-6 lg:px-6 border-r border-white/5">
                    {/* Welcome Card Banner Skeleton */}
                    <div className="w-full rounded-2xl p-6 bg-gradient-to-r from-primary/10 via-purple-950/20 to-secondary/30 border border-white/10 flex flex-col gap-3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" style={{ backgroundSize: "200% 100%", animation: "shimmer 2s infinite" }} />
                        <div className="h-6 w-48 rounded-lg bg-white/15 animate-pulse" />
                        <div className="h-4 w-72 rounded bg-white/10 animate-pulse" />
                        <div className="h-10 w-32 rounded-full bg-primary/30 mt-2 animate-pulse" />
                    </div>

                    {/* Create Post Input Box Skeleton */}
                    <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4 animate-pulse">
                        <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                        <div className="flex-1 flex flex-col gap-3">
                            <div className="h-12 w-full rounded-xl bg-white/5" />
                            <div className="flex justify-between items-center pt-2 border-t border-white/5">
                                <div className="flex gap-2">
                                    <div className="w-7 h-7 rounded-full bg-white/5" />
                                    <div className="w-7 h-7 rounded-full bg-white/5" />
                                    <div className="w-7 h-7 rounded-full bg-white/5" />
                                </div>
                                <div className="h-8 w-20 rounded-full bg-primary/20" />
                            </div>
                        </div>
                    </div>

                    {/* Feed Post Card Skeleton 1 */}
                    <div className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
                            <div className="flex flex-col gap-1.5 flex-1">
                                <div className="h-4 w-32 rounded bg-white/10 animate-pulse" />
                                <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-4 w-5/6 rounded bg-white/10 animate-pulse" />
                        <div className="h-4 w-2/3 rounded bg-white/5 animate-pulse" />
                        <div className="w-full h-56 rounded-2xl bg-white/10 animate-pulse relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" style={{ animation: "shimmer 2s infinite" }} />
                        </div>
                    </div>

                    {/* Feed Post Card Skeleton 2 */}
                    <div className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
                            <div className="flex flex-col gap-1.5 flex-1">
                                <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
                                <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
                            </div>
                        </div>
                        <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
                    </div>
                </main>

                {/* Right Sidebar Skeleton (Hidden on Mobile & Tablet) */}
                <aside className="hidden xl:flex flex-col gap-6 w-80 pt-6 pl-6 shrink-0">
                    <div className="h-11 w-full rounded-full bg-white/5 border border-white/5 animate-pulse" />
                    <div className="h-40 w-full rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col gap-3 animate-pulse">
                        <div className="h-4 w-32 rounded bg-white/10" />
                        <div className="h-10 w-full rounded-xl bg-white/5" />
                        <div className="h-10 w-full rounded-xl bg-white/5" />
                    </div>
                    <div className="h-48 w-full rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col gap-3 animate-pulse">
                        <div className="h-4 w-28 rounded bg-white/10" />
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/10" />
                            <div className="h-4 w-32 rounded bg-white/5" />
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/10" />
                            <div className="h-4 w-28 rounded bg-white/5" />
                        </div>
                    </div>
                </aside>
            </div>

            {/* Custom CSS Animation Keyframes */}
            <style jsx global>{`
                @keyframes progressLoading {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}
