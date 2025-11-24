// routes/upload.js
const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth"); // optional: require admin if needed

// Public upload (you can protect this route if only admins should upload)
// If only admins should upload, uncomment the middleware lines below.
router.post(
  "/upload",
  // isAuthenticatedUser,
  // authorizeRoles("admin"),
  uploadImage
);

module.exports = router;
