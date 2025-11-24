// controllers/uploadController.js
const cloudinary = require("cloudinary").v2;

/**
 * POST /api/v1/upload
 * Accepts:
 *  - req.files.file (multipart/form-data) OR
 *  - req.body.image (base64 data URL)
 *
 * Response:
 *  { success: true, url: "...", public_id: "..." }
 */
exports.uploadImage = async (req, res) => {
  try {
    // Priority: multipart file upload (req.files.file)
    if (req.files && req.files.file) {
      const file = req.files.file;
      // file.tempFilePath is available because express-fileupload is configured with useTempFiles
      const uploaded = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "lms_uploads",
      });

      return res.status(201).json({
        success: true,
        url: uploaded.secure_url || uploaded.url,
        public_id: uploaded.public_id,
      });
    }

    // Fallback: base64 / data URL on req.body.image
    if (req.body && req.body.image) {
      const imageData = req.body.image;
      const uploaded = await cloudinary.uploader.upload(imageData, {
        folder: "lms_uploads",
      });

      return res.status(201).json({
        success: true,
        url: uploaded.secure_url || uploaded.url,
        public_id: uploaded.public_id,
      });
    }

    // Nothing provided
    return res
      .status(400)
      .json({ success: false, message: "No file or image provided" });
  } catch (err) {
    console.error("Upload error:", err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Upload failed" });
  }
};
