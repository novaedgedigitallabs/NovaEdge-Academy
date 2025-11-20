const express = require("express");
const router = express.Router();

// Import Controller Functions
const { updateProgress, getProgress } = require("../controllers/progress");

// Import Guard
const { isAuthenticatedUser } = require("../middleware/auth");

// --- PROGRESS ROUTES ---

// URL: /api/v1/progress?courseId=...
router
  .route("/progress")
  // GET: Fetch current percentage (e.g., 40%)
  .get(isAuthenticatedUser, getProgress)

  // POST: Mark a video as "Done" (Updates DB)
  .post(isAuthenticatedUser, updateProgress);

module.exports = router;
