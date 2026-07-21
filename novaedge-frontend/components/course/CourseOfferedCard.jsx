"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function CourseOfferedCard({ course }) {
    const { title, thumbnail, originalPrice, discountedPrice, id } = course;

    return (
        <Card className="group overflow-hidden border-white/10 bg-[#0a0a0a] transition-all duration-300 hover:border-[#22c5b8]/50 hover:shadow-[0_0_20px_rgba(34,197,184,0.15)] flex flex-col h-full">
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={thumbnail || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-60" />
            </div>

            {/* Content */}
            <CardContent className="p-5 flex-grow">
                <h3 className="text-lg font-bold text-white leading-tight mb-4 group-hover:text-[#22c5b8] transition-colors line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-baseline gap-3 mt-auto">
                    <span className="text-2xl font-bold text-white">
                        ₹{discountedPrice}
                    </span>
                    <span className="text-sm text-white/40 line-through">
                        ₹{originalPrice}
                    </span>
                </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-0">
                <Button
                    className="w-full rounded-none h-12 bg-[#22c5b8] hover:bg-[#1da89d] text-black font-bold text-sm uppercase tracking-wider transition-colors"
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    );
}
