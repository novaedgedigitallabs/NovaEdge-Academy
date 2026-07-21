const Coupon = require("../models/Coupon");

// Create Coupon (Admin)
exports.createCoupon = async (req, res) => {
    try {
        const { code, discountType, value, validUntil, usageLimit, minOrderValue, maxDiscountAmount } = req.body;

        const coupon = await Coupon.create({
            code,
            discountType,
            value,
            validUntil,
            usageLimit,
            minOrderValue,
            maxDiscountAmount,
        });

        res.status(201).json({ success: true, coupon });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "Coupon code already exists" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get All Coupons (Admin)
exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Validate Coupon (Public/User)
exports.validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        if (!code) return res.status(400).json({ success: false, message: "Code is required" });

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
        });

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid coupon code" });
        }

        // Check Expiry
        if (new Date() > coupon.validUntil) {
            return res.status(400).json({ success: false, message: "Coupon expired" });
        }

        // Check Start Date
        if (new Date() < coupon.validFrom) {
            return res.status(400).json({ success: false, message: "Coupon not yet active" });
        }

        // Check Usage Limit
        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: "Coupon usage limit reached" });
        }

        // Check Min Order Value
        if (orderAmount < coupon.minOrderValue) {
            return res.status(400).json({ success: false, message: `Minimum order value of ₹${coupon.minOrderValue} required` });
        }

        // Calculate Discount
        let discount = 0;
        if (coupon.discountType === "percentage") {
            discount = (orderAmount * coupon.value) / 100;
            if (coupon.maxDiscountAmount) {
                discount = Math.min(discount, coupon.maxDiscountAmount);
            }
        } else if (coupon.discountType === "fixed") {
            discount = coupon.value;
        }

        // Ensure discount doesn't exceed order amount
        discount = Math.min(discount, orderAmount);

        res.status(200).json({
            success: true,
            valid: true,
            discount,
            finalAmount: orderAmount - discount,
            couponCode: coupon.code
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Coupon (Admin)
exports.deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await Coupon.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
