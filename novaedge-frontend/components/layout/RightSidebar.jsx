"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RightSidebar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter" && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="custom-scrollbar sticky right-0 top-0 z-20 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l border-border bg-background px-6 py-6 max-xl:hidden">
            <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search"
                    className="rounded-full bg-secondary/50 border-none pl-12 h-12 text-base focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                />
            </div>

            <div className="flex flex-col rounded-xl bg-secondary/30 border border-border p-4">
                <h3 className="text-xl font-bold mb-2">Subscribe to Premium</h3>
                <p className="text-muted-foreground mb-4">Subscribe to unlock new features and if eligible, receive a share of revenue.</p>
                <Button className="rounded-full font-bold w-fit">Subscribe</Button>
            </div>

            <div className="flex flex-col rounded-xl bg-secondary/30 border border-border pt-4">
                <h3 className="text-xl font-bold px-4 mb-4">What&apos;s happening</h3>

                <div className="flex flex-col">
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                                <span>Trending in Tech</span>
                                <span>...</span>
                            </div>
                            <p className="font-bold text-sm mb-1">#NovaEdgeLaunch</p>
                            <p className="text-xs text-muted-foreground">54.2K posts</p>
                        </div>
                    ))}
                </div>
                <div className="p-4 text-primary text-sm cursor-pointer hover:underline">
                    Show more
                </div>
            </div>
        </section>
    );
}
