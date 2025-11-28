const mongoose = require("mongoose");

const ticketCommentSchema = new mongoose.Schema({
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: [true, "Please enter comment content"],
    },
    isInternal: {
        type: Boolean,
        default: false,
    },
    attachments: [
        {
            public_id: String,
            url: String,
            filename: String,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("TicketComment", ticketCommentSchema);
