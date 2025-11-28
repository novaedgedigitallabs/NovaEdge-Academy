const express = require("express");
const router = express.Router();

const {
    createQuiz,
    getQuizzes,
    submitQuiz,
    getQuizResult,
} = require("../controllers/quiz");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public/Student
router.route("/course/:courseId/quizzes").get(isAuthenticatedUser, getQuizzes);
router.route("/quiz/:quizId/submit").post(isAuthenticatedUser, submitQuiz);
router.route("/quiz/:quizId/result").get(isAuthenticatedUser, getQuizResult);

// Admin
router.route("/course/:courseId/quiz").post(isAuthenticatedUser, authorizeRoles("admin"), createQuiz);

module.exports = router;
