const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    lectureId: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 150,
    },
    content: {
        type: String,
        required: true,
    },
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    status: {
        type: String,
        enum: ["active", "closed", "deleted"],
        default: "active",
    },
    isFlagged: {
        type: Boolean,
        default: false,
    },
    reports: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            reason: String,
            createdAt: { type: Date, default: Date.now },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

discussionSchema.index({ lectureId: 1, createdAt: -1 });

module.exports = mongoose.model("Discussion", discussionSchema);
