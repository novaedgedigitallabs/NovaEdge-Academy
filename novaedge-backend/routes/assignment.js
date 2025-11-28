const express = require("express");
const router = express.Router();

const {
    createAssignment,
    getAssignments,
    submitAssignment,
    gradeAssignment,
} = require("../controllers/assignment");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public/Student
router.route("/course/:courseId/assignments").get(isAuthenticatedUser, getAssignments);
router.route("/assignment/:assignmentId/submit").post(isAuthenticatedUser, submitAssignment);

// Admin
router.route("/course/:courseId/assignment").post(isAuthenticatedUser, authorizeRoles("admin"), createAssignment);
router.route("/assignment/:submissionId/grade").put(isAuthenticatedUser, authorizeRoles("admin"), gradeAssignment);

module.exports = router;
