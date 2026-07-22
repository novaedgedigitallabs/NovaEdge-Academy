"use client";

import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function ImageUpload({ value, onChange, placeholder = "Enter image URL or upload a file" }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error("Image file size should be less than 10MB");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        const loadingToast = toast.loading("Uploading image...");

        try {
            const response = await api.post("/api/v1/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data?.success && response.data?.url) {
                onChange(response.data.url);
                toast.success("Image uploaded successfully");
            } else {
                toast.error(response.data?.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Failed to upload image");
        } finally {
            toast.dismiss(loadingToast);
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                    <Input
                        type="url"
                        placeholder={placeholder}
                        value={value || ""}
                        onChange={(e) => onChange(e.target.value)}
                        className="pr-8 bg-secondary/30"
                    />
                    {value && (
                        <button
                            type="button"
                            onClick={() => onChange("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                            title="Clear image"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="whitespace-nowrap flex items-center gap-2 border-primary/30 hover:border-primary text-primary hover:bg-primary/10"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Uploading...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" />
                            <span>Upload File</span>
                        </>
                    )}
                </Button>
            </div>

            {value && (
                <div className="relative w-28 h-28 rounded-lg border border-border overflow-hidden group bg-secondary/20 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={value}
                        alt="Mentor Image Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onChange("")}
                            title="Remove image"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
