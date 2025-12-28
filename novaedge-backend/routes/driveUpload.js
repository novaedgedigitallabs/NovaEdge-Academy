const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadToDrive } = require("../controllers/driveUpload");
const { isAuthenticatedUser } = require("../middleware/auth");

// Configure Multer for memory storage (buffer)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: process.env.MAX_UPLOAD_BYTES
            ? parseInt(process.env.MAX_UPLOAD_BYTES)
            : 50 * 1024 * 1024, // Default 50MB
    },
});

router.post(
    "/uploads/drive",
    isAuthenticatedUser,
    upload.single("file"),
    uploadToDrive
);

module.exports = router;
