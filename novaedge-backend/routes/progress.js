const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  updateLectureProgress,
  getCourseProgress,
  getResumePosition,
  markCourseComplete,
} = require("../controllers/progress");

// Import Guard
const { isAuthenticatedUser } = require("../middleware/auth");

// --- PROGRESS ROUTES ---

// Get overall course progress
// GET /api/v1/progress/:courseId
router.route("/progress/:courseId").get(isAuthenticatedUser, getCourseProgress);

// Resume playback
// GET /api/v1/progress/:courseId/resume
router.route("/progress/:courseId/resume").get(isAuthenticatedUser, getResumePosition);

// Update specific lecture progress
// POST /api/v1/progress/:courseId/lecture/:lectureId
router.route("/progress/:courseId/lecture/:lectureId").post(isAuthenticatedUser, updateLectureProgress);

// Mark course as complete (Manual trigger)
// POST /api/v1/progress/:courseId/mark-complete
router.route("/progress/:courseId/mark-complete").post(isAuthenticatedUser, markCourseComplete);

module.exports = router;
