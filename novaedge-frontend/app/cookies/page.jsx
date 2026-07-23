import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ShieldCheck, Cookie, Info } from 'lucide-react';

export const metadata = {
    title: 'Cookie Policy | NovaEdge Academy',
    description: 'Cookie Policy for NovaEdge Academy - Learn how we use cookies and tracking technologies.',
};

export default function CookiesPage() {
    return (
        <AppLayout className="w-full">
            <div className="px-4 py-8 w-full space-y-8">
                <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Cookie className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Cookie Policy</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" /> 1. What Are Cookies?
                        </h2>
                        <p>
                            Cookies are small text files stored on your browser or device when you visit NovaEdge Academy. They help us remember your session, keep you logged in, analyze performance, and provide a personalized learning experience.
                        </p>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" /> 2. How We Use Cookies
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-xs">
                            <li><strong className="text-foreground">Essential Cookies:</strong> Required for authentication, security, and session management.</li>
                            <li><strong className="text-foreground">Analytics Cookies:</strong> Help us understand course completion rates and platform usage.</li>
                            <li><strong className="text-foreground">Preference Cookies:</strong> Store your theme settings (Dark/Light mode) and language preferences.</li>
                        </ul>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground">3. Managing Your Cookies</h2>
                        <p className="text-xs">
                            You can choose to disable or clear cookies through your browser settings at any time. However, disabling essential cookies may prevent you from logging into your account or accessing enrolled courses.
                        </p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
