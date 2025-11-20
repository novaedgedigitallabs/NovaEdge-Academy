const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  myEnrollments,
  checkEnrollment,
  getAllEnrollments,
} = require("../controllers/enrollment");

// Import Guards
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// --- STUDENT ROUTES ---

// Get list of courses I bought
// URL: /api/v1/enrollments/me
router.route("/enrollments/me").get(isAuthenticatedUser, myEnrollments);

// Check if I have access to a specific course
// URL: /api/v1/enrollment/check/:courseId
router
  .route("/enrollment/check/:courseId")
  .get(isAuthenticatedUser, checkEnrollment);

// --- ADMIN ROUTES (Boss Only) ---

// See all sales/enrollments in the system
// URL: /api/v1/admin/enrollments
router
  .route("/admin/enrollments")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllEnrollments);

module.exports = router;
