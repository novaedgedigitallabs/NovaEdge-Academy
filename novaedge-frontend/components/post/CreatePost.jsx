"use client";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { createPost } from "@/services/post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Image as ImageIcon, Smile, Calendar, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function CreatePost({ onPostCreated }) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;

        setLoading(true);
        try {
            const res = await createPost(content);
            if (res.success) {
                setContent("");
                toast.success("Post published!");
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
        <div className="flex gap-4 px-4 py-4">
            <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar?.url} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col gap-2">
                <Textarea
                    placeholder="What is happening?!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[50px] w-full resize-none border-none bg-transparent p-0 text-xl placeholder:text-muted-foreground focus-visible:ring-0"
                />
                <div className="flex items-center justify-between border-t border-border pt-3">
                    <div className="flex gap-2 text-primary">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-primary hover:bg-primary/10">
                            <ImageIcon className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-primary hover:bg-primary/10">
                            <Smile className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-primary hover:bg-primary/10">
                            <Calendar className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-primary hover:bg-primary/10">
                            <MapPin className="h-5 w-5" />
                        </Button>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={!content.trim() || loading}
                        className="rounded-full font-bold px-6"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
