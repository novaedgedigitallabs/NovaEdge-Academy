"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Download, Share2, Award, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function CertificatePage() {
    const { id } = useParams();
    const router = useRouter();
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetchCert = async () => {
            try {
                // Use the public verify endpoint to get details
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
            // Trigger download via the backend proxy endpoint
            // We use window.open or a hidden anchor tag to trigger the download
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/certificate/${id}/download`;

            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `Certificate-${id}.pdf`); // Optional, backend sets header
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Download started");
        } catch (e) {
            toast.error("Download failed");
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading certificate...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    if (!certificate) return null;

    return (
        <div className="min-h-screen flex flex-col bg-muted/10">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-3 bg-green-100 text-green-700 rounded-full mb-4">
                            <CheckCircle className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Certificate of Completion</h1>
                        <p className="text-muted-foreground">
                            Congratulations! You have successfully completed the course.
                        </p>
                    </div>

                    <div className="bg-card border rounded-xl shadow-lg overflow-hidden">
                        <div className="p-8 md:p-12 text-center space-y-8">
                            {/* Certificate Preview (Image or PDF embed) */}
                            {/* Since we have a PDF URL, we can try to embed it or show an image if available. 
                                For now, let's show a placeholder or iframe if possible, but PDF embedding can be tricky on mobile.
                                Better to show a nice card with details and the big Download button.
                            */}

                            <div className="aspect-[1.414] bg-white border-8 border-double border-gray-200 p-8 relative shadow-inner mx-auto max-w-2xl flex flex-col items-center justify-center text-black">
                                <Award className="w-24 h-24 text-yellow-500 mb-6" />
                                <h2 className="text-2xl font-serif font-bold mb-2">NovaEdge Academy</h2>
                                <p className="text-sm uppercase tracking-widest mb-8">Certificate of Completion</p>

                                <p className="text-lg mb-2">This certifies that</p>
                                <h3 className="text-3xl font-bold mb-4 font-serif text-primary">{certificate.user?.name}</h3>

                                <p className="text-lg mb-2">has successfully completed the course</p>
                                <h4 className="text-2xl font-bold mb-8 text-center">{certificate.course?.title}</h4>

                                <div className="text-sm text-gray-500 mt-auto w-full flex justify-between items-end">
                                    <div className="text-left">
                                        <p>Date: {new Date(certificate.createdAt).toLocaleDateString()}</p>
                                        <p>ID: {certificate.certificateId}</p>
                                    </div>
                                    <div className="text-right">
                                        {/* QR Code placeholder if we had the image */}
                                        <div className="w-16 h-16 bg-gray-100 border flex items-center justify-center text-xs">QR Code</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                <Button size="lg" onClick={handleDownload} className="gap-2">
                                    <Download className="w-4 h-4" /> Download PDF
                                </Button>
                                <Button size="lg" variant="outline" onClick={handleShare} className="gap-2">
                                    <Share2 className="w-4 h-4" /> Share Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
