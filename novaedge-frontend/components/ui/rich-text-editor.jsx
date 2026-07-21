"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function RichTextEditor({ value, onChange, placeholder }) {
    const quillRef = useRef(null);

    // Custom image handler
    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append("file", file);

            // We need to use fetch directly or a modified apiPost because apiPost expects JSON body by default
            // But let's try to use the existing upload logic.
            // The upload endpoint expects multipart/form-data.

            const loadingToast = toast.loading("Uploading image...");

            try {
                // Direct fetch to handle FormData
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/upload`, {
                    method: "POST",
                    body: formData,
                    // Don't set Content-Type header, let browser set it with boundary
                });

                const data = await res.json();

                if (data.success) {
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection();
                    quill.insertEmbed(range.index, "image", data.url);
                    toast.success("Image uploaded successfully");
                } else {
                    toast.error(data.message || "Upload failed");
                }
            } catch (error) {
                console.error("Image upload error:", error);
                toast.error("Failed to upload image");
            } finally {
                toast.dismiss(loadingToast);
            }
        };
    };

    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ script: "sub" }, { script: "super" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ direction: "rtl" }],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    ["link", "image", "video"],
                    ["clean"],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        }),
        []
    );

    return (
        <div className="bg-white text-black rounded-md">
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder}
                className="h-[300px] mb-12" // Add margin bottom for toolbar
            />
        </div>
    );
}
