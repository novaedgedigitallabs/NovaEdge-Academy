const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
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
    messages: [
        {
            role: {
                type: String,
                enum: ["user", "assistant"],
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            citations: [
                {
                    lectureId: String,
                    title: String,
                    timestamp: String, // Optional
                }
            ],
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ChatSession", chatSessionSchema);
