const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
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

// --- EMPLOYER ROUTE (Public) ---
// "Is this certificate ID valid?"
// URL: /api/v1/certificate/:certId (Verify)
// Note: No middleware here! It must be public for QR codes to work.
router.route("/certificate/:id").get(verifyCertificate);

module.exports = router;
