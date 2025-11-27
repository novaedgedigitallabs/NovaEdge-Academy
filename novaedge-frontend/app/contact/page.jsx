"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";

import { apiPost } from "@/lib/api";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = {
            name: `${e.target.firstName.value} ${e.target.lastName.value}`,
            email: e.target.email.value,
            subject: e.target.subject.value,
            message: e.target.message.value,
        };

        try {
            await apiPost("/api/v1/contact", formData);
            setSubmitted(true);
        } catch (err) {
            setError(err.message || "Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-grow container mx-auto px-4 py-16 max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Contact Info */}
                    <div>
                        <h1 className="text-4xl font-bold mb-6">Get in touch</h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Whether you want to become a mentor, have a question about our courses, or just want to say hi, we'd love to hear from you.
                        </p>

                        <div className="space-y-6">
                            <Card className="border-none shadow-none bg-muted/30">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Email</h3>
                                        <p className="text-muted-foreground">hello@novaedge.com</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none bg-muted/30">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Office</h3>
                                        <p className="text-muted-foreground">123 Tech Park, Innovation Way<br />San Francisco, CA 94105</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none bg-muted/30">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Phone</h3>
                                        <p className="text-muted-foreground">+1 (555) 123-4567</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Right Column: Form */}
                    <Card className="border-border/50 shadow-lg">
                        <CardHeader>
                            <CardTitle>Send us a message</CardTitle>
                            <CardDescription>
                                Fill out the form below and we'll get back to you as soon as possible.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Send className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Thank you for reaching out. We'll be in touch shortly.
                                    </p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline">
                                        Send another message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {error && (
                                        <div className="bg-destructive/10 text-destructive p-3 rounded text-sm">
                                            {error}
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
                                            <Input id="firstName" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
                                            <Input id="lastName" placeholder="Doe" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                                        <Input id="email" type="email" placeholder="john@example.com" required />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                                        <select
                                            id="subject"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            required
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="mentor">Apply to be a Mentor</option>
                                            <option value="support">Course Support</option>
                                            <option value="business">Business Inquiry</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                                        <Textarea
                                            id="message"
                                            placeholder="Tell us about your experience and why you'd like to mentor..."
                                            className="min-h-[150px]"
                                            required
                                        />
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </main>

            <Footer />
        </div>
    );
}
