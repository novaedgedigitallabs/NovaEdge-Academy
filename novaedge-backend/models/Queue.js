const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter queue name"],
        unique: true,
        trim: true,
    },
    description: String,
    agents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    autoAssignEnabled: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Queue", queueSchema);
