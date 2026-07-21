const mongoose = require("mongoose");

const userBadgeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    badge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Badge",
        required: true,
    },
    awardedAt: {
        type: Date,
        default: Date.now,
    },
    metadata: {
        type: Object, // Store context like { courseId: "..." }
    },
});

// Prevent duplicate badges for same user
userBadgeSchema.index({ user: 1, badge: 1 }, { unique: true });

module.exports = mongoose.model("UserBadge", userBadgeSchema);
