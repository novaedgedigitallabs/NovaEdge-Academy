const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
  getUserCertificates,
  downloadCertificate,
} = require("../controllers/certificate");

// Import Guard
const { isAuthenticatedUser } = require("../middleware/auth");

// --- STUDENT ROUTES (Private) ---

// Generate Certificate
// POST /api/v1/certificate/generate/:courseId
router.route("/certificate/generate/:courseId").post(isAuthenticatedUser, generateCertificate);

// Get My Certificates
// GET /api/v1/my/certificates
router.route("/my/certificates").get(isAuthenticatedUser, getMyCertificates);

// --- PUBLIC ROUTES ---

// Get User Certificates (Profile)
// GET /api/v1/certificates/user/:userId
router.route("/certificates/user/:userId").get(getUserCertificates);

// --- EMPLOYER ROUTE (Public) ---
// "Is this certificate ID valid?"
// URL: /api/v1/certificate/:id (Verify)
// Note: No middleware here! It must be public for QR codes to work.
router.route("/certificate/:id").get(verifyCertificate);

// Download Certificate
// GET /api/v1/certificate/:id/download
// We will make this "optional auth" - if you have the token, we check. If not, we rely on the ID being secret.
// But to support "req.user", we might need a middleware that extracts user but doesn't fail if not present.
// For now, let's keep it simple and allow public download if they have the ID, as the verification is public.
router.route("/certificate/:id/download").get(downloadCertificate);

module.exports = router;
