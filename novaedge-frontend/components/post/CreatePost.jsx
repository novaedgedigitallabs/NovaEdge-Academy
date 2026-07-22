"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import { createPost } from "@/services/post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Image as ImageIcon, Smile, Calendar, MapPin, X, Navigation } from "lucide-react";
import { toast } from "sonner";

const QUICK_EMOJIS = [
    "😀", "😂", "😍", "🥳", "😎", "🤩", "🚀", "🔥", "✨", 
    "💯", "💡", "🎯", "🎓", "💻", "📚", "🙏", "❤️", "👍", "📈", "💬"
];

export default function CreatePost({ onPostCreated }) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // Media & Metadata state
    const [selectedImage, setSelectedImage] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");

    // UI toggle state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);

    const fileInputRef = useRef(null);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 8 * 1024 * 1024) {
                toast.error("Image size should be less than 8MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                toast.success("Image attached!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddEmoji = (emoji) => {
        setContent((prev) => prev + emoji);
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }
        setGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const locStr = `${position.coords.latitude.toFixed(2)}°, ${position.coords.longitude.toFixed(2)}°`;
                setLocation(`Location (${locStr})`);
                setGettingLocation(false);
                setShowLocationInput(false);
                toast.success("Location added!");
            },
            () => {
                setGettingLocation(false);
                toast.error("Could not fetch location. You can type it manually.");
            }
        );
    };

    const handleSubmit = async () => {
        if (!content.trim() && !selectedImage) return;

        setLoading(true);
        try {
            const payload = {
                content: content.trim(),
                image: selectedImage,
                location: location.trim(),
                eventDate: eventDate,
            };

            const res = await createPost(payload);
            if (res.success) {
                setContent("");
                setSelectedImage("");
                setLocation("");
                setEventDate("");
                setShowEmojiPicker(false);
                setShowDatePicker(false);
                setShowLocationInput(false);
                toast.success("Post published!");
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("novaedge_post_created", { detail: res.post }));
                }
                if (onPostCreated) onPostCreated(res.post);
            } else {
                toast.error(res.message || "Failed to publish post");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="flex gap-4 px-4 py-4 border-b border-border">
            <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={user.avatar?.url} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col gap-3 min-w-0">
                <Textarea
                    placeholder="What is happening?!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[60px] w-full resize-none border-none bg-transparent p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0"
                />

                {/* Attached Image Preview */}
                {selectedImage && (
                    <div className="relative w-full max-h-72 rounded-2xl overflow-hidden border border-border group bg-black/40">
                        <img src={selectedImage} alt="Post preview" className="w-full h-full object-cover max-h-72" />
                        <button
                            onClick={() => setSelectedImage("")}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Active Badges (Location & Schedule Date) */}
                {(location || eventDate) && (
                    <div className="flex flex-wrap items-center gap-2">
                        {location && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">
                                <MapPin className="w-3.5 h-3.5" />
                                {location}
                                <button onClick={() => setLocation("")} className="hover:text-destructive ml-1 cursor-pointer">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {eventDate && (
                            <span className="flex items-center gap-1.5 text-xs font-semibold bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/20">
                                <Calendar className="w-3.5 h-3.5" />
                                {eventDate}
                                <button onClick={() => setEventDate("")} className="hover:text-destructive ml-1 cursor-pointer">
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Popovers & Toolbars */}

                {/* Emoji Bar */}
                {showEmojiPicker && (
                    <div className="p-3 bg-card border border-border rounded-xl shadow-lg flex flex-wrap gap-1.5 animate-in fade-in zoom-in-95 duration-150">
                        {QUICK_EMOJIS.map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() => handleAddEmoji(emoji)}
                                className="text-xl p-1.5 hover:bg-secondary/80 rounded-lg transition-transform hover:scale-110 cursor-pointer"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}

                {/* Date Picker Input */}
                {showDatePicker && (
                    <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-xl shadow-sm">
                        <Calendar className="w-4 h-4 text-primary shrink-0 ml-1" />
                        <Input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="text-xs bg-secondary/30 border-none h-8"
                        />
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowDatePicker(false)}
                            className="h-7 text-xs px-2"
                        >
                            Done
                        </Button>
                    </div>
                )}

                {/* Location Input & GPS */}
                {showLocationInput && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-card border border-border rounded-xl shadow-sm">
                        <div className="flex-1 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary shrink-0 ml-1" />
                            <Input
                                type="text"
                                placeholder="Enter location (e.g. New Delhi, Remote)..."
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="text-xs bg-secondary/30 border-none h-8"
                            />
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleGetLocation}
                                disabled={gettingLocation}
                                className="h-7 text-xs gap-1.5 rounded-full"
                            >
                                {gettingLocation ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Navigation className="w-3 h-3" />
                                )}
                                GPS
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowLocationInput(false)}
                                className="h-7 text-xs px-2"
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                )}

                {/* Main Action Bar */}
                <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-center gap-1 text-primary">
                        {/* Image Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => fileInputRef.current?.click()}
                            className="h-8 w-8 rounded-full text-primary hover:bg-primary/10 cursor-pointer"
                            title="Add Image"
                        >
                            <ImageIcon className="h-5 w-5" />
                        </Button>

                        {/* Emoji Toggle */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowEmojiPicker((prev) => !prev)}
                            className={`h-8 w-8 rounded-full text-primary hover:bg-primary/10 cursor-pointer ${showEmojiPicker ? "bg-primary/15" : ""}`}
                            title="Add Emoji"
                        >
                            <Smile className="h-5 w-5" />
                        </Button>

                        {/* Schedule / Date Toggle */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowDatePicker((prev) => !prev)}
                            className={`h-8 w-8 rounded-full text-primary hover:bg-primary/10 cursor-pointer ${showDatePicker || eventDate ? "bg-primary/15" : ""}`}
                            title="Add Schedule Date"
                        >
                            <Calendar className="h-5 w-5" />
                        </Button>

                        {/* Location Toggle */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowLocationInput((prev) => !prev)}
                            className={`h-8 w-8 rounded-full text-primary hover:bg-primary/10 cursor-pointer ${showLocationInput || location ? "bg-primary/15" : ""}`}
                            title="Add Location"
                        >
                            <MapPin className="h-5 w-5" />
                        </Button>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={(!content.trim() && !selectedImage) || loading}
                        className="rounded-full font-bold px-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md cursor-pointer"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
