import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { FileText, Shield, UserCheck } from 'lucide-react';

export const metadata = {
    title: 'Terms of Service | NovaEdge Academy',
    description: 'Terms of Service for NovaEdge Academy - Read our terms and conditions.',
};

export default function TermsPage() {
    return (
        <AppLayout className="w-full">
            <div className="px-4 py-8 w-full space-y-8">
                <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Terms of Service</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" /> 1. Acceptance of Terms
                        </h2>
                        <p>
                            By accessing or using NovaEdge Academy (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                        </p>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-primary" /> 2. User Accounts & Enrollment
                        </h2>
                        <p className="text-xs leading-relaxed">
                            When you create an account, you must provide accurate and complete information. You are responsible for safeguarding your credentials. When you enroll in a course, you receive a personal license to access learning materials.
                        </p>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground">3. Intellectual Property</h2>
                        <p className="text-xs">
                            The Service and its original course contents, code exercises, design elements, and logos remain the exclusive property of NovaEdge Academy and its instructors.
                        </p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
