import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Megaphone, Sparkles, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
    title: 'Ads & Partnerships | NovaEdge Academy',
    description: 'Ads & Partnerships information for NovaEdge Academy.',
};

export default function AdsPage() {
    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-8 max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Megaphone className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ads & Partnerships</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Sponsorships, Partnered Courses & Developer Outreach</p>
                    </div>
                </div>

                <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" /> Promote With NovaEdge
                        </h2>
                        <p>
                            Reach thousands of active developers, software engineers, and Tech leaders. We partner with tech brands, developer tools, and hiring companies to deliver non-intrusive, relevant tech promotions.
                        </p>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" /> Ad Guidelines
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-xs">
                            <li>All promotions must be strictly developer-focused and relevant.</li>
                            <li>We do not sell personal user data or track users across external sites.</li>
                            <li>Sponsored content is transparently labeled as Sponsored.</li>
                        </ul>
                    </section>

                    <div className="text-center pt-4">
                        <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                            <Link href="/contact">Get in Touch for Partnerships</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
