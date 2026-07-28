const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
  getUserCertificates,
  downloadCertificate,
  adminGenerateCertificate,
  getAllCertificates,
  adminDeleteCertificate,
} = require("../controllers/certificate");

// Import Guard
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// --- STUDENT ROUTES (Private) ---

// Generate Certificate
// POST /api/v1/certificate/generate/:courseId
router.route("/certificate/generate/:courseId").post(isAuthenticatedUser, generateCertificate);

// Get My Certificates
// GET /api/v1/my/certificates & /api/v1/certificates/me
router.route("/my/certificates").get(isAuthenticatedUser, getMyCertificates);
router.route("/certificates/me").get(isAuthenticatedUser, getMyCertificates);

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
router.route("/certificate/:id/download").get(downloadCertificate);

// --- ADMIN ROUTES ---
// POST /api/v1/admin/certificate/generate
router.route("/admin/certificate/generate").post(isAuthenticatedUser, authorizeRoles("admin"), adminGenerateCertificate);
// GET /api/v1/admin/certificates
router.route("/admin/certificates").get(isAuthenticatedUser, authorizeRoles("admin"), getAllCertificates);
// DELETE /api/v1/admin/certificate/:id
router.route("/admin/certificate/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), adminDeleteCertificate);

module.exports = router;
