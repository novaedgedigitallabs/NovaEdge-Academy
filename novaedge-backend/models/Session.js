const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    ip: String,
    userAgent: String,
    browser: String,
    os: String,
    device: String,
    location: {
        city: String,
        country: String,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isRevoked: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: 0 }, // Auto-delete after expiry
    },
});

module.exports = mongoose.model("Session", sessionSchema);
