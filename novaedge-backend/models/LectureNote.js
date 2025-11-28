const mongoose = require("mongoose");

const lectureNoteSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    lectureId: {
        type: String, // Subdocument ID from Course.lectures
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    keyPoints: [
        {
            type: String,
        },
    ],
    mcqs: [
        {
            question: String,
            options: [String],
            correctAnswer: String, // Should match one of the options
            explanation: String,
        },
    ],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending", // In a real system, might default to approved if confidence is high
    },
    version: {
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Ensure one note per lecture (or use versioning for multiple)
lectureNoteSchema.index({ courseId: 1, lectureId: 1 }, { unique: true });

module.exports = mongoose.model("LectureNote", lectureNoteSchema);
