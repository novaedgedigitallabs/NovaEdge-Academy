const express = require("express");
const router = express.Router();

// Import Controller Functions
const {
  getAllCourses,
  createCourse,
  getCourseLectures,
  addLecture,
  deleteCourse,
  updateCourse, // new
} = require("../controllers/courses");

// Import Middleware
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// --- PUBLIC ROUTES ---

// Get all courses (Catalog)
// URL: /api/v1/courses
router.route("/courses").get(getAllCourses);

// --- PROTECTED ROUTES (Student) ---

// Get lectures of a specific course
// URL: /api/v1/course/:id
// Note: We check if they are logged in.
// (Frontend handles the "Check Enrollment" logic before calling this)
router.route("/course/:id").get(isAuthenticatedUser, getCourseLectures);

// --- ADMIN ROUTES (Boss Only) ---

// Create a new course
// URL: /api/v1/course/new
router
  .route("/course/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createCourse);

// Add Video/Lecture to a course AND Delete Course
// URL: /api/v1/course/:id
// routes/courses.js (snippet)
router
  .route("/course/:id")
  // POST = Add Lecture
  .post(isAuthenticatedUser, authorizeRoles("admin"), addLecture)
  // PUT = Update course metadata (admin)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateCourse)
  // DELETE = Remove Course
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCourse);

module.exports = router;
