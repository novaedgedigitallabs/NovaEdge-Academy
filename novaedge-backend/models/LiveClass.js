const mongoose = require("mongoose");

const liveClassSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    provider: {
        type: String,
        enum: ["zoom", "meet", "jitsi", "other"],
        default: "other",
    },
    meetingLink: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["scheduled", "live", "completed", "cancelled"],
        default: "scheduled",
    },
    recordingUrl: {
        type: String, // Link to the recording after it's done
    },
    attendees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("LiveClass", liveClassSchema);
