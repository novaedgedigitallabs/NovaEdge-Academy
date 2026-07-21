const mongoose = require("mongoose");

const analyticsEventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: [
            "page_view",
            "checkout_start",
            "purchase",
            "lecture_view",
            "lecture_progress",
            "signup",
            "login"
        ],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    lectureId: {
        type: String, // Can be ObjectId or string ID
    },
    meta: {
        type: mongoose.Schema.Types.Mixed, // Flexible for revenue, progress %, etc.
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true, // Important for time-range queries
    },
});

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
