const express = require("express");
const {
    getMentorProfile,
    uploadLecture,
    editLecture,
    createAssignment,
    getCourseAssignments,
    getCourseStudents,
    getStudentPerformance,
    getCourseQuestions,
    replyToQuestion,
    gradeSubmission,
    getMentorAnalytics,
} = require("../controllers/mentor");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { isCourseMentor } = require("../middleware/mentor");

const router = express.Router();

// Apply global mentor checks
router.use(isAuthenticatedUser, authorizeRoles("mentor", "admin"));

// Dashboard & Analytics
router.route("/me").get(getMentorProfile);
router.route("/analytics/overview").get(getMentorAnalytics);

// Course Management
router.route("/course/:courseId/lecture").post(isCourseMentor, uploadLecture);
router.route("/course/:courseId/lecture/:lectureId").put(isCourseMentor, editLecture);

// Assignment Management
router.route("/course/:courseId/assignment").post(isCourseMentor, createAssignment);
router.route("/course/:courseId/assignments").get(isCourseMentor, getCourseAssignments);

// Student Management
router.route("/course/:courseId/students").get(isCourseMentor, getCourseStudents);
router.route("/course/:courseId/student/:studentId/performance").get(isCourseMentor, getStudentPerformance);

// Questions & Grading
router.route("/course/:courseId/questions").get(isCourseMentor, getCourseQuestions);
router.route("/question/:questionId/reply").post(replyToQuestion); // Note: Might need course check if not implicit
router.route("/assignment/:submissionId/grade").put(gradeSubmission);

module.exports = router;
