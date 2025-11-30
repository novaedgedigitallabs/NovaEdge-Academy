const express = require("express");
const router = express.Router();

// Import the Chef (Controller Functions)
const {
  registerUser,
  loginUser,
  logout,
  getUserProfile,
  getPublicProfile,
  updateProfile,
} = require("../controllers/auth");

// Import the Security Guard (Middleware)
const { isAuthenticatedUser } = require("../middleware/auth");

// --- PUBLIC ROUTES (Anyone can access) ---

// Path: /api/v1/register
router.route("/register").post(registerUser);

// Path: /api/v1/login
router.route("/login").post(loginUser);

// Path: /api/v1/logout
router.route("/logout").get(logout);

// Path: /api/v1/user/:id (Public Profile)
router.route("/user/:id").get(getPublicProfile);

// --- PROTECTED ROUTES (Must be logged in) ---

// Path: /api/v1/me
router.route("/me").get(isAuthenticatedUser, getUserProfile);

// Path: /api/v1/me/update
router.route("/me/update").put(isAuthenticatedUser, updateProfile);

module.exports = router;
