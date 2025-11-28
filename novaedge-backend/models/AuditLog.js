const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    actor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
        index: true, // e.g., "COURSE_CREATE", "USER_UPDATE"
    },
    target: {
        type: {
            type: String, // e.g., "Course", "User"
            required: true,
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        label: String, // Human readable label e.g., Course Title
    },
    changes: {
        before: mongoose.Schema.Types.Mixed,
        after: mongoose.Schema.Types.Mixed,
    },
    metadata: {
        ip: String,
        userAgent: String,
        location: String,
        additionalInfo: mongoose.Schema.Types.Mixed,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true, // Important for range queries
        immutable: true, // Prevent updates
    },
});

// Prevent updates/deletes on this collection via Mongoose (application level)
auditLogSchema.pre("findOneAndUpdate", function (next) {
    next(new Error("Audit logs are immutable."));
});

auditLogSchema.pre("findOneAndDelete", function (next) {
    next(new Error("Audit logs cannot be deleted. Use retraction."));
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
