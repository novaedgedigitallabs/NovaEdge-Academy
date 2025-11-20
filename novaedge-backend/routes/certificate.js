const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  getCertificate,
  verifyCertificate,
} = require("../controllers/certificate");

// Import Guard
const { isAuthenticatedUser } = require("../middleware/auth");

// --- STUDENT ROUTE (Private) ---
// "Give me my certificate for this course"
// URL: /api/v1/certificate/:courseId
router.route("/certificate/:courseId").get(isAuthenticatedUser, getCertificate);

// --- EMPLOYER ROUTE (Public) ---
// "Is this certificate ID valid?"
// URL: /api/v1/certificate/verify/:id
// Note: No middleware here! It must be public for QR codes to work.
router.route("/certificate/verify/:id").get(verifyCertificate);

module.exports = router;
