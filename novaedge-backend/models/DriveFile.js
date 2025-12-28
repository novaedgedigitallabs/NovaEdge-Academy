const mongoose = require("mongoose");

const driveFileSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    driveFileId: {
        type: String,
        required: true,
    },
    folderId: {
        type: String,
        required: true,
    },
    webViewLink: {
        type: String,
        required: true,
    },
    webContentLink: {
        type: String,
        required: true,
    },
    storage: {
        type: String,
        default: "drive",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("DriveFile", driveFileSchema);
