"use client";

import { useEffect, useState } from "react";
import { getPlans, createSubscription, verifySubscription } from "@/services/subscription";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function PricingPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const router = useRouter();

    useEffect(() => {
        getPlans().then(data => {
            setPlans(data.plans);
            setLoading(false);
        });
    }, []);

    const handleSubscribe = async (plan) => {
        setProcessing(plan._id);
        try {
            const { subscription_id, key } = await createSubscription(plan._id);

            const options = {
                key,
                subscription_id,
                name: "NovaEdge Academy",
                description: plan.name,
                handler: async function (response) {
                    try {
                        await verifySubscription({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        toast.success("Subscription active!");
                        router.push("/subscription");
                    } catch (e) {
                        toast.error("Verification failed");
                    }
                },
                theme: { color: "#000000" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (e) {
            toast.error(e.message || "Failed to start subscription");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <main className="flex-grow container mx-auto py-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
                    <p className="text-muted-foreground">Unlock all courses with a single subscription.</p>
                </div>

                {loading ? (
                    <div className="text-center">Loading plans...</div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div key={plan._id} className="border rounded-xl p-8 flex flex-col hover:shadow-lg transition-shadow">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="text-4xl font-bold mb-6">
                                    ₹{plan.price}
                                    <span className="text-base font-normal text-muted-foreground">/{plan.interval}</span>
                                </div>
                                <p className="text-muted-foreground mb-6">{plan.description}</p>

                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <Check className="w-5 h-5 text-green-500" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={!!processing}
                                    className="w-full"
                                >
                                    {processing === plan._id ? <Loader2 className="animate-spin" /> : "Subscribe Now"}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
