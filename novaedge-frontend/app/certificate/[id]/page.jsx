"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, Link as LinkIcon, Linkedin, ShieldCheck, Printer, FileImage, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import CertificateTemplate from "@/components/certificate/CertificateTemplate";
import { toPng } from "html-to-image";

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloadingImage, setDownloadingImage] = useState(false);

    useEffect(() => {
        if (!id) return;
        const fetchCert = async () => {
            try {
                const data = await apiGet(`/api/v1/certificate/${id}`);
                setCertificate(data?.certificate || data);
            } catch (err) {
                // If API fails or is demo mode, create fallback demo state for previewing
                console.warn("API load error, falling back to certificate metadata:", err);
                setError(err.message || "Certificate not found");
            } finally {
                setLoading(false);
            }
        };
        fetchCert();
    }, [id]);

    const handlePrintPDF = () => {
        window.print();
    };

    const handleDownloadImage = async () => {
        const node = document.getElementById("certificate-print-area");
        if (!node) return;
        setDownloadingImage(true);
        try {
            toast.loading("Generating high-resolution certificate image...", { id: "cert-img" });
            const dataUrl = await toPng(node, { quality: 0.98, pixelRatio: 2 });
            const link = document.createElement("a");
            link.download = `Certificate_${certificate?.certificateId || id || "NEA"}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Certificate image downloaded successfully!", { id: "cert-img" });
        } catch (err) {
            console.error("Error generating image:", err);
            toast.error("Image generation fallback: opening print view", { id: "cert-img" });
            window.print();
        } finally {
            setDownloadingImage(false);
        }
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Certificate verification link copied to clipboard!");
    };

    const handleLinkedInShare = () => {
        const url = window.location.href;
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#070B14] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 font-medium animate-pulse">Loading Verified Certificate...</p>
                </div>
            </div>
        );
    }

    // Dynamic data resolution
    const recipientName = certificate?.user?.name || user?.name || "Your Name Here";
    const courseTitle = certificate?.course?.title || "ADVANCED FULL STACK WEB DEVELOPMENT";
    const issueDate = certificate?.issueDate || certificate?.createdAt || new Date().toISOString();
    const certificateId = certificate?.certificateId || (typeof id === 'string' ? id : "NEA-2025-05-0001");

    return (
        <div className="min-h-screen flex flex-col bg-[#070B14] font-sans text-white">
            {/* Top Navigation Bar */}
            <header className="w-full border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50 print:hidden">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2.5 font-black text-xl tracking-tighter text-white hover:opacity-90 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-purple-300">
                            NovaEdge Academy
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Verified Certificate</span>
                        </div>

                        {user && (
                            <Avatar className="h-9 w-9 border-2 border-white/10">
                                <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 md:py-14">
                <div className="w-full max-w-5xl space-y-8">
                    {/* Error Banner if API error occurred but fallback preview active */}
                    {error && (
                        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl text-center text-xs sm:text-sm print:hidden">
                            Showing preview mode: {error}
                        </div>
                    )}

                    {/* Certificate Presentation Container */}
                    <div className="relative group">
                        {/* Soft Ambient Background Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 via-indigo-600/20 to-blue-600/20 rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none print:hidden" />

                        <div className="relative rounded-lg overflow-hidden shadow-2xl transition-transform duration-300">
                            {/* Render exact Certificate Template */}
                            <CertificateTemplate
                                recipientName={recipientName}
                                courseTitle={courseTitle}
                                issueDate={issueDate}
                                certificateId={certificateId}
                                signatoryName="Amit Kumar Raikwar"
                                signatorySignatureText="Amit Raikwar"
                                signatoryRole="FOUNDER & CEO"
                                organization="NovaEdge Digital Labs"
                            />
                        </div>
                    </div>

                    {/* Action Bar / Controls */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 print:hidden pt-2">
                        <Button
                            size="lg"
                            onClick={handleLinkedInShare}
                            className="bg-[#0077b5] hover:bg-[#006396] text-white rounded-full px-6 sm:px-8 h-12 text-sm font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                        >
                            <Linkedin className="w-4 h-4 mr-2 fill-current" />
                            Share on LinkedIn
                        </Button>

                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={handleDownloadImage}
                            disabled={downloadingImage}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-6 sm:px-8 h-12 text-sm font-bold backdrop-blur-md transition-all hover:scale-105"
                        >
                            <FileImage className="w-4 h-4 mr-2 text-purple-400" />
                            Download Image (PNG)
                        </Button>

                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={handlePrintPDF}
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-6 sm:px-8 h-12 text-sm font-bold backdrop-blur-md transition-all hover:scale-105"
                        >
                            <Printer className="w-4 h-4 mr-2 text-blue-400" />
                            Print / Save as PDF
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleCopyLink}
                            className="bg-transparent hover:bg-white/5 text-gray-300 border-white/15 rounded-full px-6 h-12 text-sm font-semibold transition-all"
                        >
                            <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                            Copy Credential Link
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-6 border-t border-white/10 text-center print:hidden text-xs text-gray-500">
                <p>
                    Official Verified Credential · ID: <span className="font-mono text-gray-400">{certificateId}</span> · Issued by NovaEdge Digital Labs
                </p>
            </footer>
        </div>
    );
}                                  