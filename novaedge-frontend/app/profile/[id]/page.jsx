"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getUserCertificates } from "@/services/certificate";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Award } from "lucide-react";

export default function PublicProfilePage() {
    const { id } = useParams();
    const [certificates, setCertificates] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getUserCertificates(id);
                const certs = res.certificates || [];
                setCertificates(certs);

                if (certs.length > 0) {
                    setUser(certs[0].user);
                } else {
                    // If no certificates, we can't easily get user info from this endpoint alone
                    // In a real app, we'd have a separate getUserProfile endpoint
                    setUser(null);
                }
            } catch (err) {
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin" />
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center text-destructive">
                    <p>Error: {error}</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                {/* User Header */}
                <div className="flex flex-col items-center text-center mb-12">
                    <Avatar className="w-32 h-32 mb-4">
                        <AvatarImage src={user?.avatar?.url || "/placeholder.svg"} alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-3xl font-bold">{user?.name || "User Profile"}</h1>
                    <p className="text-muted-foreground">
                        {certificates.length > 0 ? "Student at NovaEdge Academy" : "No public certificates found"}
                    </p>
                </div>

                {/* Certificates Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Award className="w-6 h-6 text-primary" />
                        <h2 className="text-2xl font-bold">Earned Certificates</h2>
                    </div>

                    {certificates.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                            <p className="text-muted-foreground">This user has not earned any certificates yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2">
                            {certificates.map((cert) => (
                                <Card key={cert._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                    <div className="aspect-video bg-muted relative">
                                        {/* Placeholder for certificate preview if we had an image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-gray-100">
                                            <Award className="w-12 h-12 opacity-20" />
                                        </div>
                                        {/* If we had a thumbnail, we'd show it here */}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="line-clamp-1">{cert.course?.title}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-mono text-muted-foreground">{cert.certificateId}</span>
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                    View Certificate
                                                </a>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
