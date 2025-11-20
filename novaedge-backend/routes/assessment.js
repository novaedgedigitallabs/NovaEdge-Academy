const express = require("express");
const router = express.Router();

// Import Controller Functions
// (We will build these next!)
const {
  createAssessment,
  getAssessment,
  submitAssessment,
  deleteAssessment,
} = require("../controllers/assessment");

// Import Guards
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// --- STUDENT ROUTES ---

// 1. Get the Quiz for a specific course
// URL: /api/v1/assessment/:courseId
router.route("/assessment/:courseId").get(isAuthenticatedUser, getAssessment);

// 2. Submit answers for grading
// URL: /api/v1/assessment/submit
router.route("/assessment/submit").post(isAuthenticatedUser, submitAssessment);

// --- ADMIN ROUTES (Boss Only) ---

// 3. Create a new Quiz
// URL: /api/v1/assessment/new
router
  .route("/assessment/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createAssessment);

// 4. Delete a Quiz
// URL: /api/v1/assessment/:id
router
  .route("/assessment/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteAssessment);

module.exports = router;
