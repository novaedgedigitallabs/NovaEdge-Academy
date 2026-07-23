import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Eye, CheckCircle2, HeartHandshake } from 'lucide-react';

export const metadata = {
    title: 'Accessibility Statement | NovaEdge Academy',
    description: 'Accessibility Statement for NovaEdge Academy - Learn about our commitment to accessible learning.',
};

export default function AccessibilityPage() {
    return (
        <AppLayout className="w-full">
            <div className="px-4 py-8 w-full space-y-8">
                <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Eye className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Accessibility Statement</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <HeartHandshake className="w-4 h-4 text-primary" /> Our Commitment
                        </h2>
                        <p>
                            NovaEdge Academy is committed to ensuring digital accessibility for all learners, including individuals with visual, auditory, motor, or cognitive disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.
                        </p>
                    </section>

                    <section className="bg-card/40 border border-border/60 rounded-2xl p-6 backdrop-blur-md">
                        <h2 className="text-lg font-bold mb-3 text-foreground flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary" /> Accessibility Features
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-xs">
                            <li><strong className="text-foreground">Keyboard Navigation:</strong> Full focus state support across buttons, forms, and course navigation.</li>
                            <li><strong className="text-foreground">Screen Reader Support:</strong> Semantic HTML5 markup and descriptive ARIA labels.</li>
                            <li><strong className="text-foreground">High Contrast Dark Mode:</strong> Tailored color palettes tested for optimal legibility.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
