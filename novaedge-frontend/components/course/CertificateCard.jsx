"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function CertificateCard({ certificate }) {
    const shareUrl = `${window.location.origin}/verify/${certificate.certificateId}`;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Certificate',
                text: `Check out my certificate for ${certificate.course.title}!`,
                url: shareUrl,
            });
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow">
            <CardHeader className="bg-muted/20 pb-4">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-primary">Certificate of Completion</CardTitle>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-2">
                <p className="text-sm text-muted-foreground">Course</p>
                <h3 className="text-xl font-semibold">{certificate.course.title}</h3>

                <div className="flex justify-between text-sm mt-4">
                    <div>
                        <p className="text-muted-foreground">Issued On</p>
                        <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-muted-foreground">ID</p>
                        <p className="font-mono text-xs">{certificate.certificateId}</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => window.open(certificate.pdfUrl, "_blank")}>
                    <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button className="flex-1" onClick={handleShare}>
                    <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
            </CardFooter>
        </Card>
    );
}
