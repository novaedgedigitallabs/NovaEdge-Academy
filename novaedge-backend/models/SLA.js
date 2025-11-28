const mongoose = require("mongoose");

const slaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter SLA name"],
        unique: true,
        trim: true,
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        required: true,
        unique: true,
    },
    responseTimeMinutes: {
        type: Number,
        required: true,
        default: 60, // 1 hour
    },
    resolutionTimeMinutes: {
        type: Number,
        required: true,
        default: 1440, // 24 hours
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("SLA", slaSchema);
