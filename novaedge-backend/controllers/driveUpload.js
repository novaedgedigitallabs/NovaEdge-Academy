const { google } = require("googleapis");
const DriveFile = require("../models/DriveFile");
const stream = require("stream");
const path = require("path");

// Configure Google Auth
// We expect GOOGLE_APPLICATION_CREDENTIALS env var to point to the JSON file
// OR we can parse SERVICE_ACCOUNT_JSON env var if provided directly
let auth;

const getAuth = () => {
    // Option 1: OAuth2 (Recommended for personal accounts)
    if (process.env.GOOGLE_REFRESH_TOKEN) {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI || "https://developers.google.com/oauthplayground"
        );
        oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        return oAuth2Client;
    }

    // Option 2: Service Account (Works for Shared Drives)
    if (auth) return auth;

    if (process.env.SERVICE_ACCOUNT_JSON) {
        // Parse JSON from env var
        const keys = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
        auth = new google.auth.GoogleAuth({
            credentials: keys,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });
    } else {
        // Fallback to GOOGLE_APPLICATION_CREDENTIALS file path
        auth = new google.auth.GoogleAuth({
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });
    }
    return auth;
};

exports.uploadToDrive = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const driveService = google.drive({ version: "v3", auth: getAuth() });

        const fileMetadata = {
            name: req.file.originalname,
            parents: [process.env.DRIVE_FOLDER_ID], // Folder ID from env
        };

        const media = {
            mimeType: req.file.mimetype,
            body: stream.Readable.from(req.file.buffer),
        };

        const response = await driveService.files.create({
            resource: fileMetadata,
            media: media,
            fields: "id, webViewLink, webContentLink",
            supportsAllDrives: true,
        });

        const fileId = response.data.id;

        // Make the file publicly readable
        await driveService.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
            supportsAllDrives: true,
        });

        // Save metadata to DB
        const driveFile = await DriveFile.create({
            filename: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploader: req.user._id,
            driveFileId: fileId,
            webViewLink: response.data.webViewLink,
            webContentLink: response.data.webContentLink,
            storage: "drive",
        });

        res.status(201).json({
            success: true,
            message: "File uploaded to Google Drive successfully",
            file: driveFile,
        });
    } catch (error) {
        console.error("Drive Upload Error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to upload to Google Drive",
        });
    }
};
