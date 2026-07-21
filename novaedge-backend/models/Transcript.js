const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    lectureId: {
        type: String, // Subdocument ID from Course.lectures
        required: true,
    },
    segments: [
        {
            start: { type: Number, required: true }, // Start time in seconds
            end: { type: Number, required: true },   // End time in seconds
            text: { type: String, required: true },
        }
    ],
    language: {
        type: String,
        default: "en",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for fast retrieval
transcriptSchema.index({ courseId: 1, lectureId: 1 }, { unique: true });

module.exports = mongoose.model("Transcript", transcriptSchema);
