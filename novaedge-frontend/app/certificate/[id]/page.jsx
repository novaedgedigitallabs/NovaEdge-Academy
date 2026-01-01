"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, Link as LinkIcon, Linkedin, Award, QrCode, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchCert = async () => {
            try {
                const data = await apiGet(`/api/v1/certificate/${id}`);
                setCertificate(data.certificate);
            } catch (err) {
                setError(err.message || "Certificate not found");
            } finally {
                setLoading(false);
            }
        };
        fetchCert();
    }, [id]);

    const handleDownload = async () => {
        try {
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/certificate/${id}/download`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `Certificate-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("Download started");
        } catch (e) {
            toast.error("Download failed");
        }
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Credential link copied!");
    };

    const handleLinkedInShare = () => {
        const url = window.location.href;
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading certificate...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 bg-white">{error}</div>;
    if (!certificate) return null;

    return (
        <div className="min-h-screen flex flex-col bg-white font-sans">
            {/* Minimalist Header */}
            <header className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-blue-600">
                        <ShieldCheck className="w-8 h-8" />
                        <span>NovaEdge</span>
                    </Link>
                    {user && (
                        <Avatar className="h-9 w-9 border-2 border-gray-100">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 lg:py-20">
                <div className="w-full max-w-5xl space-y-12">
                    {/* Certificate Display */}
                    <div className="relative group">
                        {/* Decorative Background Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative bg-white border-[12px] border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-sm overflow-hidden aspect-[1.414] flex flex-col items-center justify-center p-12 md:p-20 text-center">
                            {/* Geometric Border Pattern */}
                            <div className="absolute inset-0 border-[2px] border-blue-600/20 m-4 pointer-events-none" />
                            <div className="absolute inset-0 border-[1px] border-purple-600/10 m-6 pointer-events-none" />

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-blue-600 m-8 pointer-events-none" />
                            <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-purple-600 m-8 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-blue-600 m-8 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-purple-600 m-8 pointer-events-none" />

                            {/* Certificate Content */}
                            <div className="space-y-8 z-10">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-black tracking-widest text-gray-900 uppercase">NovaEdge Academy</h2>
                                    <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full" />
                                </div>

                                <h3 className="text-4xl md:text-5xl font-serif font-bold text-gray-800 tracking-tight">
                                    CERTIFICATE OF COMPLETION
                                </h3>

                                <div className="space-y-4">
                                    <p className="text-lg text-gray-500 font-medium italic">This is to certify that</p>
                                    <h4 className="text-4xl md:text-5xl font-black text-blue-600 tracking-tight">
                                        {certificate.user?.name || "Alex Johnson"}
                                    </h4>
                                    <p className="text-lg text-gray-500 font-medium italic">has successfully completed the</p>
                                    <h5 className="text-2xl md:text-3xl font-bold text-gray-900 max-w-2xl mx-auto leading-tight">
                                        {certificate.course?.title || "Full Stack Web Development Bootcamp (MERN + Next.js)"}
                                    </h5>
                                </div>

                                <p className="text-lg font-bold text-gray-700">
                                    Date: {new Date(certificate.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>

                                <div className="pt-12 flex items-end justify-between w-full max-w-3xl mx-auto">
                                    <div className="text-left space-y-2">
                                        <div className="font-serif text-3xl text-blue-600/80 italic">Instructor Signature</div>
                                        <div className="h-px w-48 bg-gray-300" />
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Instructor Signature</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-2 border-2 border-gray-100 rounded-xl bg-gray-50">
                                            <QrCode className="w-16 h-16 text-gray-900" />
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Scan to verify</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button
                            size="lg"
                            onClick={handleLinkedInShare}
                            className="bg-[#0077b5] hover:bg-[#006396] text-white rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                        >
                            <Linkedin className="w-5 h-5 mr-2 fill-current" />
                            Share on LinkedIn
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleDownload}
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full px-8 h-14 text-base font-bold transition-all hover:border-gray-300"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Download PDF
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleCopyLink}
                            className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full px-8 h-14 text-base font-bold transition-all hover:border-gray-300"
                        >
                            <LinkIcon className="w-5 h-5 mr-2" />
                            Copy Credential Link
                        </Button>
                    </div>
                </div>
            </main>

            {/* Footer Info */}
            <footer className="py-8 border-t border-gray-50 text-center">
                <p className="text-sm text-gray-400 font-medium">
                    Verified by NovaEdge Academy · Certificate ID: {certificate.certificateId}
                </p>
            </footer>
        </div>
    );
}
