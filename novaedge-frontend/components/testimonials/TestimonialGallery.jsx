"use client";

import { useState, useEffect } from "react";
import { getTestimonials } from "@/services/testimonials";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function TestimonialGallery({ courseId, featured }) {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await getTestimonials({ courseId, featured });
                setTestimonials(res.data);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, [courseId, featured]);

    if (loading) return <Loader2 className="h-8 w-8 animate-spin mx-auto" />;
    if (testimonials.length === 0) return <div className="text-center text-muted-foreground">No testimonials yet.</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
                <Card key={t._id} className="overflow-hidden flex flex-col h-full">
                    <div className="relative aspect-video bg-black">
                        {t.videoUrl ? (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="w-full h-full cursor-pointer group relative">
                                        <img
                                            src={t.thumbnailUrl || "/placeholder-video.jpg"}
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform" />
                                        </div>
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl p-0 bg-black border-none">
                                    <video src={t.videoUrl} controls autoPlay className="w-full h-full" />
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                No Video
                            </div>
                        )}
                    </div>

                    <CardContent className="p-4 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-3">
                            <Avatar>
                                <AvatarImage src={t.user?.avatar?.url} />
                                <AvatarFallback>{t.user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="font-semibold text-sm">{t.user?.name}</div>
                                {t.isVerifiedStudent && (
                                    <Badge variant="secondary" className="text-[10px] h-5">Verified Student</Badge>
                                )}
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground italic flex-1">"{t.text}"</p>
                        {t.course && (
                            <div className="mt-3 text-xs text-primary font-medium">
                                Course: {t.course.title}
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
