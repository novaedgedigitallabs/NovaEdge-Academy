"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { verifyCertificate } from "@/services/certificate";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await verifyCertificate(id);
                setData(res);
            } catch (e) {
                setError(e.message || "Verification failed");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-lg shadow-xl">
                    <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Certificate Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {loading ? (
                            <div className="flex flex-col items-center py-8">
                                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                                <p>Verifying certificate...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center py-8 text-red-500">
                                <XCircle className="w-16 h-16 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Invalid Certificate</h3>
                                <p className="text-center text-muted-foreground">{error}</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-6">
                                <div className="flex flex-col items-center text-green-600">
                                    <CheckCircle className="w-20 h-20 mb-4" />
                                    <h3 className="text-2xl font-bold">Verified & Valid</h3>
                                </div>

                                <div className="w-full space-y-4 border rounded-lg p-6 bg-muted/30">
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <span className="text-muted-foreground">Student:</span>
                                        <span className="col-span-2 font-semibold">{data.certificate.user.name}</span>

                                        <span className="text-muted-foreground">Course:</span>
                                        <span className="col-span-2 font-semibold">{data.certificate.course.title}</span>

                                        <span className="text-muted-foreground">Issued:</span>
                                        <span className="col-span-2 font-semibold">{new Date(data.certificate.issueDate).toLocaleDateString()}</span>

                                        <span className="text-muted-foreground">ID:</span>
                                        <span className="col-span-2 font-mono text-xs">{data.certificate.certificateId}</span>
                                    </div>
                                </div>

                                <Link href="/" className="text-primary hover:underline">
                                    Verify another certificate at NovaEdge Academy
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
