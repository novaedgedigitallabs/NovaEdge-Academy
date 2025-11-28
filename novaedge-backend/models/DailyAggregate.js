const mongoose = require("mongoose");

const dailyAggregateSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        unique: true, // One doc per day
    },
    revenue: {
        type: Number,
        default: 0,
    },
    newUsers: {
        type: Number,
        default: 0,
    },
    activeUsers: {
        type: Number,
        default: 0,
    },
    purchases: {
        type: Number,
        default: 0,
    },
    courseMetrics: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
            views: { type: Number, default: 0 },
            checkouts: { type: Number, default: 0 },
            purchases: { type: Number, default: 0 },
            revenue: { type: Number, default: 0 },
        }
    ],
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("DailyAggregate", dailyAggregateSchema);
