"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet } from "@/lib/api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Calendar } from "lucide-react";

export default function PublicProfilePage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await apiGet(`/api/v1/user/${id}`);
                if (res.success) {
                    // Combine user data and certificates for easier rendering
                    setUser({ ...res.user, certificates: res.certificates });
                } else {
                    setError(res.message || "User not found");
                }
            } catch (err) {
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
                        <p className="text-muted-foreground">{error || "The user you are looking for does not exist."}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: User Info */}
                    <div className="md:col-span-1">
                        <Card className="text-center p-6 h-full">
                            <div className="flex flex-col items-center">
                                <Avatar className="w-32 h-32 mb-4 border-4 border-primary/10">
                                    <AvatarImage src={user.avatar?.url || "/placeholder.svg"} alt={user.name} />
                                    <AvatarFallback className="text-4xl">{user.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
                                <p className="text-muted-foreground capitalize mb-4">{user.role}</p>

                                <div className="w-full space-y-3 text-left">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </div>
                                    {user.email && (
                                        <div className="flex items-center text-sm text-muted-foreground break-all">
                                            <span className="font-semibold mr-2">Email:</span> {user.email}
                                        </div>
                                    )}
                                    {/* Add other fields here if available in User model */}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Certificates & Achievements */}
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Certificates Earned</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {user.certificates && user.certificates.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {user.certificates.map((cert) => (
                                            <div key={cert._id} className="border rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                                                <div className="aspect-video relative bg-muted rounded overflow-hidden">
                                                    {/* Use course poster or a placeholder */}
                                                    <img
                                                        src={cert.course?.poster?.url || "/placeholder.svg"}
                                                        alt={cert.course?.title}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold line-clamp-1">{cert.course?.title}</h3>
                                                    <p className="text-xs text-muted-foreground">Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
                                                    <p className="text-xs text-muted-foreground">ID: {cert.certificateId}</p>
                                                </div>
                                                <a
                                                    href={`${process.env.NEXT_PUBLIC_API_URL || ""}/api/v1/certificate/${cert.certificateId}/download`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="mt-auto w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
                                                >
                                                    View Certificate
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No certificates earned yet.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
