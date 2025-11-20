const express = require("express");
const router = express.Router();

// Import the Chef (Controller Functions)
const {
  registerUser,
  loginUser,
  logout,
  getUserProfile,
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

// --- PROTECTED ROUTES (Must be logged in) ---

// Path: /api/v1/me
router.route("/me").get(isAuthenticatedUser, getUserProfile);

module.exports = router;
