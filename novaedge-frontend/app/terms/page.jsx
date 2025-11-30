import React from 'react';

export const metadata = {
    title: 'Terms of Service | NovaEdge Academy',
    description: 'Terms of Service for NovaEdge Academy - Read our terms and conditions.',
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        By accessing or using NovaEdge Academy ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. User Accounts</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Intellectual Property</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of NovaEdge Academy and its licensors. The Service is protected by copyright, trademark, and other laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Course Enrollment and Access</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        When you enroll in a course, you get a license from us to view it via the NovaEdge Academy services and for no other use. You may not transfer or resell courses in any way. We grant you a lifetime access license, except when we must disable the course for legal or policy reasons.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Prohibited Conduct</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        You agree not to use the Service:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>In any way that violates any applicable national or international law or regulation.</li>
                        <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                        <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Termination</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Changes to Terms</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about these Terms, please contact us at support@novaedge.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
