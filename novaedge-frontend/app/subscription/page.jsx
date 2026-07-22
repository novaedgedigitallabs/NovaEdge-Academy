"use client";

import { useEffect, useState } from "react";
import { getMySubscription, cancelSubscription } from "@/services/subscription";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SubscriptionPage() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        getMySubscription()
            .then(data => {
                setSubscription(data?.subscription || null);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async () => {
        if (!confirm("Are you sure? You will lose access at the end of the billing period.")) return;
        setCancelling(true);
        try {
            await cancelSubscription();
            toast.success("Subscription cancelled");
            const data = await getMySubscription();
            setSubscription(data?.subscription || null);
        } catch (e) {
            toast.error(e.message || "Failed to cancel subscription.");
        } finally {
            setCancelling(false);
        }
    };

    return (
        <AppLayout className="max-w-5xl">
            <div className="px-4 py-8 space-y-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        My Subscription
                    </h1>
                    <p className="text-xs text-muted-foreground">
                        Manage your active plan, billing period, and subscription status.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : !subscription ? (
                    <div className="text-center py-12 px-4 border border-border/70 bg-card/40 backdrop-blur-md rounded-2xl space-y-3">
                        <CreditCard className="w-10 h-10 text-primary mx-auto opacity-60" />
                        <h2 className="text-lg font-bold text-foreground">No active subscription</h2>
                        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                            Subscribe to unlock all premium courses, 1-on-1 mentorship calls, and certificates.
                        </p>
                        <Button asChild size="sm" className="rounded-full px-6 font-bold h-9 bg-primary text-primary-foreground">
                            <Link href="/pricing">View Subscription Plans <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
                        </Button>
                    </div>
                ) : (
                    <div className="border border-border/70 bg-card/60 backdrop-blur-xl rounded-2xl p-6 space-y-6 shadow-xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-foreground">{subscription.plan?.name || "Pro Plan"}</h2>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={subscription.status === "active" ? "default" : "secondary"} className="text-[10px]">
                                        {(subscription.status || "active").toUpperCase()}
                                    </Badge>
                                    {subscription.cancel_at_period_end && <Badge variant="destructive" className="text-[10px]">Cancelling</Badge>}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-foreground">₹{subscription.plan?.price || 499}</div>
                                <div className="text-xs text-muted-foreground">/{subscription.plan?.interval || "month"}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border/50">
                            <div>
                                <div className="text-xs text-muted-foreground">Start Date</div>
                                <div className="text-xs font-semibold text-foreground">{new Date(subscription.current_start || Date.now()).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-xs text-muted-foreground">Expiry / Next Billing</div>
                                <div className="text-xs font-semibold text-foreground">{new Date(subscription.current_end || Date.now() + 30*24*60*60*1000).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            {subscription.status === "active" && !subscription.cancel_at_period_end && (
                                <Button variant="destructive" size="sm" onClick={handleCancel} disabled={cancelling} className="rounded-full text-xs font-bold px-4">
                                    {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Cancel Subscription"}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
