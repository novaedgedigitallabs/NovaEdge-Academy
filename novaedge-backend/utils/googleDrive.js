const { google } = require("googleapis");
const stream = require("stream");
const User = require("../models/User");

// 1. Authentication (Reused from driveUpload controller)
let auth;
const getAuth = () => {
    if (auth) return auth;

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

    // Option 2: Service Account
    if (process.env.SERVICE_ACCOUNT_JSON) {
        const keys = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);
        auth = new google.auth.GoogleAuth({
            credentials: keys,
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });
    } else {
        auth = new google.auth.GoogleAuth({
            scopes: ["https://www.googleapis.com/auth/drive.file"],
        });
    }
    return auth;
};

// 2. Find or Create Folder
const findOrCreateFolder = async (driveService, folderName, parentId) => {
    const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and '${parentId}' in parents and trashed=false`;

    const res = await driveService.files.list({
        q: query,
        fields: "files(id, name)",
        spaces: "drive",
    });

    if (res.data.files.length > 0) {
        return res.data.files[0].id;
    }

    // Create if not exists
    const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
    };

    const file = await driveService.files.create({
        resource: fileMetadata,
        fields: "id",
        supportsAllDrives: true,
    });

    return file.data.id;
};

// 3. Ensure User Folder Exists
exports.ensureUserFolder = async (userId, username) => {
    const authClient = getAuth();
    const driveService = google.drive({ version: "v3", auth: authClient });
    const rootDriveId = process.env.DRIVE_FOLDER_ID;

    // A. Ensure "Users" root folder exists
    // We check if we already have a cached ID for "Users" folder, or we look it up in the root
    // For simplicity, let's look it up inside DRIVE_FOLDER_ID
    const usersRootId = await findOrCreateFolder(driveService, "Users", rootDriveId);

    // B. Ensure User-specific folder exists
    const sanitizedUsername = username ? username.replace(/[^a-zA-Z0-9]/g, "_") : `user_${userId}`;
    const folderName = `${sanitizedUsername}_${userId}`; // Unique name

    // Check if user already has a folderId saved
    const user = await User.findById(userId);
    if (user.driveFolderId) {
        // Verify it still exists? For performance, let's assume it does or handle error later.
        // But to be safe, let's just return it. If it's deleted, we might fail upload and need to recreate.
        // For now, let's trust the DB.
        return user.driveFolderId;
    }

    const userFolderId = await findOrCreateFolder(driveService, folderName, usersRootId);

    // Save to User model
    user.driveFolderId = userFolderId;
    await user.save();

    return userFolderId;
};

// 4. Upload File to Folder
exports.uploadFileToFolder = async (fileBuffer, filename, mimeType, folderId) => {
    const authClient = getAuth();
    const driveService = google.drive({ version: "v3", auth: authClient });

    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    const fileMetadata = {
        name: filename,
        parents: [folderId],
    };

    const media = {
        mimeType: mimeType,
        body: bufferStream,
    };

    const response = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id, webViewLink, webContentLink, size",
        supportsAllDrives: true,
    });

    const fileId = response.data.id;

    // Make public
    await driveService.permissions.create({
        fileId: fileId,
        requestBody: {
            role: "reader",
            type: "anyone",
        },
        supportsAllDrives: true,
    });

    return response.data;
};
