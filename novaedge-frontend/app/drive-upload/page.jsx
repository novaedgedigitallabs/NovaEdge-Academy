"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/context/auth-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, Mic, Square, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { apiPost } from "@/lib/api";
import axios from "axios";

export default function DriveUploadPage() {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setAudioBlob(null); // Clear recorded audio if file selected
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "audio/webm" });
                setAudioBlob(blob);
                setFile(null); // Clear file input if audio recorded
            };

            mediaRecorderRef.current.start();
            setRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            toast.error("Could not access microphone");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
            // Stop all tracks
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleUpload = async () => {
        const fileToUpload = file || (audioBlob ? new File([audioBlob], "recording.webm", { type: "audio/webm" }) : null);

        if (!fileToUpload) {
            toast.error("Please select a file or record audio");
            return;
        }

        setUploading(true);
        setUploadedFile(null);

        const formData = new FormData();
        formData.append("file", fileToUpload);

        try {
            // We use axios directly here for easier FormData handling with progress if needed, 
            // but apiPost wrapper is also fine. Let's use axios to ensure multipart/form-data is handled correctly 
            // and we can attach credentials.
            // Note: apiPost wrapper might stringify body, so we need to be careful.
            // Let's use standard fetch or axios with credentials.

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/uploads/drive`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                setUploadedFile(res.data.file);
                toast.success("File uploaded successfully!");
                setFile(null);
                setAudioBlob(null);
            }
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error(error.response?.data?.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UploadCloud className="w-6 h-6" />
                            Upload to Google Drive
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Select File</Label>
                            <Input type="file" onChange={handleFileChange} disabled={uploading || recording} />
                        </div>

                        <div className="relative flex items-center justify-center py-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or Record Audio</span>
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            {!recording ? (
                                <Button variant="outline" onClick={startRecording} disabled={uploading || !!file}>
                                    <Mic className="w-4 h-4 mr-2" />
                                    Start Recording
                                </Button>
                            ) : (
                                <Button variant="destructive" onClick={stopRecording}>
                                    <Square className="w-4 h-4 mr-2" />
                                    Stop Recording
                                </Button>
                            )}
                        </div>

                        {audioBlob && (
                            <div className="text-center text-sm text-green-500 font-medium">
                                Audio recorded ready for upload.
                            </div>
                        )}

                        <Button
                            className="w-full"
                            onClick={handleUpload}
                            disabled={uploading || (!file && !audioBlob)}
                        >
                            {uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload to Drive"
                            )}
                        </Button>

                        {uploadedFile && (
                            <div className="mt-6 p-4 border rounded-lg bg-muted/30 space-y-3">
                                <div className="flex items-center gap-2 text-green-600 font-semibold">
                                    <CheckCircle className="w-5 h-5" />
                                    Upload Complete
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-semibold">Filename:</span> {uploadedFile.filename}</p>
                                    <p><span className="font-semibold">Size:</span> {(uploadedFile.size / 1024).toFixed(2)} KB</p>
                                    <p><span className="font-semibold">Type:</span> {uploadedFile.mimeType}</p>
                                </div>
                                <div className="pt-2">
                                    <Label className="mb-1 block">Public Link</Label>
                                    <div className="flex gap-2">
                                        <Input readOnly value={uploadedFile.webViewLink} />
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                navigator.clipboard.writeText(uploadedFile.webViewLink);
                                                toast.success("Link copied!");
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <a
                                        href={uploadedFile.webViewLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm"
                                    >
                                        Open in Google Drive
                                    </a>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
