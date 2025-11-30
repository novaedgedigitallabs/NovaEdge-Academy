import React from 'react';

export const metadata = {
    title: 'Privacy Policy | NovaEdge Academy',
    description: 'Privacy Policy for NovaEdge Academy - Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

            <div className="space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Welcome to NovaEdge Academy ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We collect information that you provide directly to us, such as when you create an account, enroll in a course, or contact us for support. This may include:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Personal identification information (Name, email address, phone number, etc.)</li>
                        <li>Payment information (processed securely by our payment providers)</li>
                        <li>Profile information (Bio, profile picture, social links)</li>
                        <li>Course progress and performance data</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                        <li>Provide, operate, and maintain our services</li>
                        <li>Process your transactions and manage your enrollments</li>
                        <li>Send you administrative information, such as updates and security alerts</li>
                        <li>Personalize your learning experience</li>
                        <li>Improve our website and course offerings</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Security</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Your Rights</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. You can manage most of your personal data directly through your account settings.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Contact Us</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        If you have any questions about this Privacy Policy, please contact us at support@novaedge.com.
                    </p>
                </section>
            </div>
        </div>
    );
}
