const mongoose = require("mongoose");

const hashtagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    postsCount: {
        type: Number,
        default: 0,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    clicks: {
        type: Number,
        default: 0,
    },
    lastUsed: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model("Hashtag", hashtagSchema);
