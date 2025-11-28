const mongoose = require("mongoose");

const lectureVersionSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    lectureId: {
        type: mongoose.Schema.Types.ObjectId, // Subdocument ID
        required: true,
    },
    version: {
        type: Number,
        required: true,
    },
    data: {
        title: String,
        description: String,
        video: {
            public_id: String,
            url: String,
        },
        duration: Number,
        notes: {
            public_id: String,
            url: String,
        },
    },
    changelog: {
        type: String,
        required: true,
    },
    updateType: {
        type: String,
        enum: ["minor", "major", "rollback"],
        default: "minor",
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Compound index to ensure unique version per lecture
lectureVersionSchema.index({ courseId: 1, lectureId: 1, version: 1 }, { unique: true });

module.exports = mongoose.model("LectureVersion", lectureVersionSchema);
