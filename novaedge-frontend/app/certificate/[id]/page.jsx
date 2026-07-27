"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, Link as LinkIcon, Linkedin, ShieldCheck, QrCode, Sparkles } from "lucide-react";
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

    const handleDownload = () => window.print();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Credential link copied!");
    };

    const handleLinkedInShare = () => {
        const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`;
        window.open(shareUrl, '_blank');
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08080E] text-gray-400 font-sans">
                Loading certificate...
            </div>
        );
    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#08080E] text-red-400 font-sans">
                {error}
            </div>
        );
    if (!certificate) return null;

    return (
        <div className="min-h-screen flex flex-col bg-[#08080E] font-sans relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] print:hidden" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] print:hidden" />

            {/* Header */}
            <header className="w-full border-b border-white/5 bg-[#0E0E18]/70 backdrop-blur-md sticky top-0 z-50 print:hidden">
                <div className="container mx-auto flex h-16 items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        <ShieldCheck className="w-7 h-7 text-purple-400" />
                        <span>NovaEdge</span>
                    </Link>
                    {user && (
                        <Avatar className="h-9 w-9 border-2 border-white/10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 lg:py-20 relative z-10">
                <div className="w-full max-w-5xl space-y-12">

                    {/* Certificate Card */}
                    <div className="relative group">
                        {/* Animated gradient border frame */}
                        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-purple-600 via-cyan-500 to-amber-500 opacity-60 blur-sm group-hover:opacity-90 transition-opacity duration-700" />

                        <div className="relative bg-[#0E0E18] rounded-2xl overflow-hidden aspect-[1.414] flex flex-col items-center justify-center p-10 md:p-16 text-center border border-white/10">

                            {/* Subtle grid texture */}
                            <div
                                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                                    backgroundSize: "32px 32px",
                                }}
                            />

                            {/* Gold inner border */}
                            <div className="absolute inset-6 border border-amber-500/30 rounded-xl pointer-events-none" />

                            {/* Corner accents in gold */}
                            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-amber-500/60 rounded-tl-xl pointer-events-none" />
                            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-cyan-400/60 rounded-tr-xl pointer-events-none" />
                            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-cyan-400/60 rounded-bl-xl pointer-events-none" />
                            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-amber-500/60 rounded-br-xl pointer-events-none" />

                            {/* Content */}
                            <div className="space-y-7 z-10">
                                <div className="space-y-3 flex flex-col items-center">
                                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                        <span className="text-xs font-bold tracking-[0.2em] text-purple-300 uppercase">
                                            NovaEdge Academy
                                        </span>
                                    </div>
                                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                                </div>

                                <h3 className="text-3xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                                    Certificate of Completion
                                </h3>

                                <div className="space-y-4">
                                    <p className="text-base text-gray-500 font-medium italic">This is to certify that</p>
                                    <h4 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-400">
                                        {certificate.user?.name || "Alex Johnson"}
                                    </h4>
                                    <p className="text-base text-gray-500 font-medium italic">has successfully completed the</p>
                                    <h5 className="text-xl md:text-2xl font-bold text-gray-100 max-w-2xl mx-auto leading-tight">
                                        {certificate.course?.title || "Full Stack Web Development Bootcamp (MERN + Next.js)"}
                                    </h5>
                                </div>

                                <p className="text-sm font-bold text-gray-400 tracking-wide">
                                    Issued on{" "}
                                    {new Date(certificate.createdAt).toLocaleDateString('en-US', {
                                        month: 'long', day: 'numeric', year: 'numeric',
                                    })}
                                </p>

                                <div className="pt-10 flex items-end justify-between w-full max-w-3xl mx-auto">
                                    <div className="text-left space-y-2">
                                        <div className="font-serif text-2xl italic text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                                            NovaEdge
                                        </div>
                                        <div className="h-px w-40 bg-white/15" />
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            Instructor Signature
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-2 border border-amber-500/30 rounded-xl bg-white">
                                            <QrCode className="w-14 h-14 text-black" />
                                        </div>
                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                                            Scan to verify
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
                        <Button
                            size="lg"
                            onClick={handleLinkedInShare}
                            className="bg-[#0077b5] hover:bg-[#006396] text-white rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-blue-900/30 transition-all hover:scale-105"
                        >
                            <Linkedin className="w-5 h-5 mr-2 fill-current" />
                            Share on LinkedIn
                        </Button>

                        <Button
                            size="lg"
                            onClick={handleDownload}
                            className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-full px-8 h-14 text-base font-bold shadow-lg shadow-purple-900/30 transition-all hover:scale-105 hover:brightness-110"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Print / Save as PDF
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            onClick={handleCopyLink}
                            className="border-white/15 text-gray-300 hover:bg-white/5 rounded-full px-8 h-14 text-base font-bold transition-all hover:border-white/30"
                        >
                            <LinkIcon className="w-5 h-5 mr-2" />
                            Copy Credential Link
                        </Button>
                    </div>
                </div>
            </main>

            <footer className="py-8 border-t border-white/5 text-center print:hidden relative z-10">
                <p className="text-sm text-gray-500 font-medium">
                    Verified by NovaEdge Academy · Certificate ID: {certificate.certificateId}
                </p>
            </footer>
        </div>
    );
}