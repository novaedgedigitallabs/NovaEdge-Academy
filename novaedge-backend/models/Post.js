const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: [true, "Please enter post content"],
        trim: true,
        maxLength: [2000, "Post cannot exceed 2000 characters"],
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    repostOf: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null,
    },
    hashtags: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    views: {
        type: Number,
        default: 0,
    }
});

module.exports = mongoose.model("Post", postSchema);
