"use client";

import { useEffect, useState } from "react";
import { getPlans, createSubscription, verifySubscription } from "@/services/subscription";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Script from "next/script";
import { useRouter } from "next/navigation";

const DEFAULT_PLANS = [
    {
        _id: "plan_free",
        name: "Starter",
        price: 0,
        interval: "month",
        description: "Perfect for exploring free courses and community discussions.",
        features: ["Access to free course previews", "Community feed & discussion forum", "Standard email support"]
    },
    {
        _id: "plan_pro",
        name: "Pro Membership",
        price: 499,
        interval: "month",
        popular: true,
        description: "Unlimited access to all courses, 1-on-1 mentorship, and certificates.",
        features: ["Access to ALL 50+ Premium Courses", "1-on-1 Mentorship Booking Access", "Verified Completion Certificates", "Priority Support & Code Reviews"]
    },
    {
        _id: "plan_annual",
        name: "Annual VIP Pass",
        price: 3999,
        interval: "year",
        description: "Best value! Save 33% with full annual membership benefits.",
        features: ["Everything in Pro Membership", "Save 33% over monthly billing", "Downloadable source code & notes", "Exclusive VIP Mentor Discord badge"]
    }
];

export default function PricingPage() {
    const [plans, setPlans] = useState(DEFAULT_PLANS);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);
    const router = useRouter();

    useEffect(() => {
        getPlans()
            .then(data => {
                if (data?.plans && Array.isArray(data.plans) && data.plans.length > 0) {
                    setPlans(data.plans);
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleSubscribe = async (plan) => {
        if (plan.price === 0) {
            toast.success("You are on the free Starter plan!");
            return;
        }

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
                theme: { color: "#7c3aed" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (e) {
            toast.error(e.message || "Failed to start subscription. Please try again.");
        } finally {
            setProcessing(null);
        }
    };

    return (
        <AppLayout className="max-w-5xl">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="px-4 py-8 space-y-8">
                {/* Header Banner */}
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
                        Simple, Transparent Pricing
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Unlock all premium courses, 1-on-1 mentorship, and verified certificates with a single plan.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <div 
                            key={plan._id} 
                            className={`relative rounded-2xl p-6 flex flex-col justify-between border transition-all duration-300 ${
                                plan.popular 
                                    ? "bg-card/80 border-primary shadow-xl -translate-y-1" 
                                    : "bg-card/40 backdrop-blur-md border-border/70 hover:border-primary/40"
                            }`}
                        >
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                                    Most Popular
                                </Badge>
                            )}

                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                                <p className="text-xs text-muted-foreground mb-4 min-h-[32px]">{plan.description}</p>
                                
                                <div className="text-3xl font-black text-foreground mb-6 flex items-baseline gap-1">
                                    ₹{plan.price}
                                    <span className="text-xs font-semibold text-muted-foreground">/{plan.interval}</span>
                                </div>

                                <ul className="space-y-2.5 mb-8">
                                    {(plan.features || []).map((f, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-foreground/90">
                                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                            <span>{f}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                onClick={() => handleSubscribe(plan)}
                                disabled={!!processing}
                                className={`w-full rounded-full font-bold h-10 text-xs shadow-md ${
                                    plan.popular 
                                        ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                                        : "bg-secondary text-foreground hover:bg-secondary/80"
                                }`}
                            >
                                {processing === plan._id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : plan.price === 0 ? (
                                    "Get Started Free"
                                ) : (
                                    <>
                                        <Zap className="w-3.5 h-3.5 mr-1.5" /> Subscribe Now
                                    </>
                                )}
                            </Button>
                        </div>
                    ))}
                </div>

                {/* Trust Footer */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground border-t border-border/40">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure 256-bit Encrypted Checkout
                    </span>
                    <span>•</span>
                    <span>Cancel Anytime</span>
                    <span>•</span>
                    <span>Instant Access</span>
                </div>
            </div>
        </AppLayout>
    );
}
