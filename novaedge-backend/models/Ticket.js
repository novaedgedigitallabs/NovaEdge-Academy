const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, "Please enter a subject"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter a description"],
    },
    status: {
        type: String,
        enum: ["open", "pending", "resolved", "closed"],
        default: "open",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium",
    },
    source: {
        type: String,
        enum: ["web", "email", "phone", "chat"],
        default: "web",
    },
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    requesterEmail: String,
    requesterName: String,
    assignee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    queue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Queue",
    },
    tags: [String],
    slaDueAt: Date,
    metadata: {
        type: Map,
        of: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    resolvedAt: Date,
    closedAt: Date,
});

ticketSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
