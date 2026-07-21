const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
        required: true,
    },
    razorpay_subscription_id: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["created", "authenticated", "active", "past_due", "cancelled", "completed", "expired", "halted"],
        default: "created",
    },
    current_start: Date,
    current_end: Date,
    cancel_at_period_end: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
