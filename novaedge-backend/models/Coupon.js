const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: String,
    discountType: {
        type: String,
        enum: ["percentage", "fixed"],
        required: true,
    },
    value: {
        type: Number,
        required: true, // Percentage (e.g., 20) or Fixed Amount (e.g., 500)
    },
    maxDiscountAmount: {
        type: Number, // Only for percentage (e.g., up to 1000 off)
    },
    minOrderValue: {
        type: Number,
        default: 0,
    },
    validFrom: {
        type: Date,
        default: Date.now,
    },
    validUntil: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number, // Total times this coupon can be used
        default: null, // null = infinite
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Coupon", couponSchema);
