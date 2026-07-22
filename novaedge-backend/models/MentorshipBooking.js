const mongoose = require("mongoose");

const mentorshipBookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
        required: true,
    },
    mentorName: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        default: "1-on-1 Career & Code Review Guidance",
    },
    status: {
        type: String,
        enum: ["confirmed", "pending", "cancelled"],
        default: "confirmed",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("MentorshipBooking", mentorshipBookingSchema);
