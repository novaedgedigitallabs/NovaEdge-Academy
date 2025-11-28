const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Discussion",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    upvotes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    isSolution: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["active", "deleted"],
        default: "active",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Comment", commentSchema);
