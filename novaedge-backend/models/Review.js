const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Published", "Rejected"],
        default: "Published", // Auto-publish by default, can change to Pending if strict moderation needed
    },
    reports: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            reason: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    helpful: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Prevent duplicate reviews
reviewSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
