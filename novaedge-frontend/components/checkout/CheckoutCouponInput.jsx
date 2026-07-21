"use client";

import { useState } from "react";
import { validateCoupon } from "@/services/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Tag } from "lucide-react";
import { toast } from "sonner";

export default function CheckoutCouponInput({ orderAmount, onCouponApplied }) {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const handleApply = async () => {
        if (!code.trim()) return;
        setLoading(true);
        try {
            const data = await validateCoupon(code, orderAmount);
            if (data.valid) {
                setAppliedCoupon(data);
                onCouponApplied(data);
                toast.success(`Coupon applied! You saved ₹${data.discount}`);
            }
        } catch (e) {
            toast.error(e.message || "Invalid coupon");
            setAppliedCoupon(null);
            onCouponApplied(null);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = () => {
        setAppliedCoupon(null);
        setCode("");
        onCouponApplied(null);
    };

    return (
        <div className="border p-4 rounded space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
                <Tag className="w-4 h-4" /> Coupon Code
            </h2>

            {appliedCoupon ? (
                <div className="bg-green-50 border border-green-200 p-3 rounded flex justify-between items-center">
                    <div>
                        <p className="font-bold text-green-700">{appliedCoupon.couponCode}</p>
                        <p className="text-xs text-green-600">₹{appliedCoupon.discount} discount applied</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRemove} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                        Remove
                    </Button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <Input
                        placeholder="Enter code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="uppercase"
                    />
                    <Button onClick={handleApply} disabled={loading || !code}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                    </Button>
                </div>
            )}
        </div>
    );
}
