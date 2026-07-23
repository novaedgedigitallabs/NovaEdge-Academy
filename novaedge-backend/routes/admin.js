const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getCoursePerformance,
} = require("../controllers/admin");

// Import Guards
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// --- GLOBAL ADMIN PANEL PROTECTION ---
router.use(isAuthenticatedUser, authorizeRoles("admin", "mentor", "agent"));

// --- DASHBOARD STATS ---
router.route("/stats").get(getDashboardStats);

// --- USER MANAGEMENT ---
router.route("/users").get(authorizeRoles("admin", "agent"), getAllUsers);

router
  .route("/user/:id")
  .put(authorizeRoles("admin"), updateUserRole)
  .delete(authorizeRoles("admin"), deleteUser);

// --- CERTIFICATE MANAGEMENT ---
const { adminGenerateCertificate } = require("../controllers/certificate");
router.route("/certificate/generate").post(authorizeRoles("admin", "mentor", "agent"), adminGenerateCertificate);

// --- COURSE PERFORMANCE ---
router.route("/course-performance").get(authorizeRoles("admin", "mentor"), getCoursePerformance);

module.exports = router;
