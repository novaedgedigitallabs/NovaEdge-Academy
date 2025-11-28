const mongoose = require("mongoose");

const autoAssignRuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter rule name"],
        trim: true,
    },
    conditions: {
        type: Map,
        of: mongoose.Schema.Types.Mixed, // e.g., { "source": "email", "subject": { "$regex": "billing" } }
        required: true,
    },
    action: {
        type: String,
        enum: ["assign_queue", "assign_agent"],
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, // Queue ID or User ID
    },
    priority: {
        type: Number,
        default: 0, // Higher number = higher priority
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

module.exports = mongoose.model("AutoAssignRule", autoAssignRuleSchema);
