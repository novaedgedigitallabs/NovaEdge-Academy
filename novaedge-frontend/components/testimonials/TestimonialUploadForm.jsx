"use client";

import { useState } from "react";
import { createTestimonial } from "@/services/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

export default function TestimonialUploadForm({ courseId }) {
    const [text, setText] = useState("");
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 50 * 1024 * 1024) { // 50MB limit
                toast.error("File size too large (max 50MB)");
                return;
            }
            setVideo(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) {
            toast.error("Please add some text");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("text", text);
        if (courseId) formData.append("courseId", courseId);
        if (video) formData.append("video", video);

        try {
            await createTestimonial(formData);
            toast.success("Testimonial submitted successfully! It will be visible after moderation.");
            setText("");
            setVideo(null);
            setPreview(null);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Failed to submit testimonial");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 border p-6 rounded-lg bg-card">
            <h3 className="text-xl font-semibold">Share your story</h3>

            <div className="space-y-2">
                <Label htmlFor="text">Your Review</Label>
                <Textarea
                    id="text"
                    placeholder="Tell us about your experience..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="video">Video Review (Optional)</Label>
                <div className="flex items-center gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("video-upload").click()}
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        {video ? "Change Video" : "Upload Video"}
                    </Button>
                    <Input
                        id="video-upload"
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {video && <span className="text-sm text-muted-foreground">{video.name}</span>}
                </div>
                {preview && (
                    <video src={preview} controls className="mt-4 w-full max-h-[300px] rounded-md bg-black" />
                )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    </>
                ) : (
                    "Submit Testimonial"
                )}
            </Button>
        </form>
    );
}
