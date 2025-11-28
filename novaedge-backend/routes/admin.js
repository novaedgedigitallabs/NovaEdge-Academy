const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/admin");

// Import Guards
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// --- GLOBAL ADMIN PROTECTION ---
// We can apply middleware to ALL routes in this file at once!
// Now we don't have to write it for every single line.
router.use(isAuthenticatedUser, authorizeRoles("admin"));

// --- DASHBOARD ---
// URL: /api/v1/admin/stats
router.route("/stats").get(getDashboardStats);

// --- USER MANAGEMENT ---

// Get list of all users
// URL: /api/v1/admin/users
router.route("/users").get(getAllUsers);

// Manage specific user (Promote/Demote/Ban)
// URL: /api/v1/admin/user/:id
router
  .route("/user/:id")
  .put(updateUserRole) // PUT = Update data (Role)
  .delete(deleteUser); // DELETE = Remove user

module.exports = router;
