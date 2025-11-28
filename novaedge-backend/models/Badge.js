const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a badge name"],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
    },
    iconUrl: {
        type: String,
        required: [true, "Please add an icon URL"], // Can be a path to local SVG or Cloudinary URL
    },
    tier: {
        type: String,
        enum: ["bronze", "silver", "gold", "platinum"],
        default: "bronze",
    },
    criteria: {
        type: {
            type: String,
            enum: ["EVENT", "THRESHOLD", "MANUAL"],
            required: true,
        },
        event: {
            type: String, // e.g., "COURSE_COMPLETED", "LOGIN_STREAK"
        },
        threshold: {
            type: Number, // e.g., 5 (for 5 courses completed)
        },
        field: {
            type: String, // e.g., "coursesCompleted" (field to check against threshold)
        },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Badge", badgeSchema);
