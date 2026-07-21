"use client";

import { useEffect, useState } from "react";
import { getMySubscription, cancelSubscription } from "@/services/subscription";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SubscriptionPage() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        getMySubscription().then(data => {
            setSubscription(data.subscription);
            setLoading(false);
        });
    }, []);

    const handleCancel = async () => {
        if (!confirm("Are you sure? You will lose access at the end of the billing period.")) return;
        setCancelling(true);
        try {
            await cancelSubscription();
            toast.success("Subscription cancelled");
            // Refresh
            const data = await getMySubscription();
            setSubscription(data.subscription);
        } catch (e) {
            toast.error(e.message || "Failed to cancel");
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto py-20 px-4 max-w-3xl">
                <h1 className="text-3xl font-bold mb-8">My Subscription</h1>

                {loading ? (
                    <div>Loading...</div>
                ) : !subscription ? (
                    <div className="text-center py-12 border rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">No active subscription</h2>
                        <Button asChild>
                            <a href="/pricing">View Plans</a>
                        </Button>
                    </div>
                ) : (
                    <div className="border rounded-lg p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold">{subscription.plan.name}</h2>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={subscription.status === "active" ? "default" : "secondary"}>
                                        {subscription.status.toUpperCase()}
                                    </Badge>
                                    {subscription.cancel_at_period_end && <Badge variant="destructive">Cancelling</Badge>}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">₹{subscription.plan.price}</div>
                                <div className="text-sm text-muted-foreground">/{subscription.plan.interval}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                            <div>
                                <div className="text-sm text-muted-foreground">Start Date</div>
                                <div className="font-medium">{new Date(subscription.current_start).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground">Next Billing / Expiry</div>
                                <div className="font-medium">{new Date(subscription.current_end).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            {subscription.status === "active" && !subscription.cancel_at_period_end && (
                                <Button variant="destructive" onClick={handleCancel} disabled={cancelling}>
                                    {cancelling ? <Loader2 className="animate-spin" /> : "Cancel Subscription"}
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
