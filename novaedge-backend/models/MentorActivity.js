const mongoose = require("mongoose");

const mentorActivitySchema = new mongoose.Schema({
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        type: Object,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("MentorActivity", mentorActivitySchema);
