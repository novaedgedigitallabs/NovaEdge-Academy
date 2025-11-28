const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    price: {
        type: Number,
        required: true,
    },
    interval: {
        type: String,
        enum: ["monthly", "yearly"],
        required: true,
    },
    razorpay_plan_id: {
        type: String,
        required: true,
    },
    features: [String],
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Plan", planSchema);
