import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export const metadata = {
    title: 'Privacy Policy | NovaEdge Academy',
    description: 'Privacy Policy for NovaEdge Academy - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <AppLayout className="w-full">
            <div className="px-4 py-8 w-full space-y-8">
                <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Lock className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" /> 1. Introduction
                        </h2>
                        <p>
                            Welcome to NovaEdge Academy (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                        </p>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-primary" /> 2. Information We Collect
                        </h2>
                        <p className="mb-3">
                            We collect information that you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This may include:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-xs">
                            <li><strong className="text-foreground">Personal Identification:</strong> Name, email address, phone number, etc.</li>
                            <li><strong className="text-foreground">Payment Information:</strong> Processed securely by our payment providers.</li>
                            <li><strong className="text-foreground">Profile Information:</strong> Bio, profile picture, social links.</li>
                            <li><strong className="text-foreground">Course Progress:</strong> Quiz scores, certificates earned, and performance data.</li>
                        </ul>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground">3. How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 text-xs">
                            <li>Provide, operate, and maintain our educational services.</li>
                            <li>Process your transactions and manage course enrollments.</li>
                            <li>Send administrative notifications, system updates, and security alerts.</li>
                            <li>Personalize your learning recommendations.</li>
                        </ul>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground">4. Data Security</h2>
                        <p className="text-xs">
                            We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.
                        </p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
