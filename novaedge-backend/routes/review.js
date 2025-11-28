const express = require("express");
const router = express.Router();

const {
    createReview,
    getCourseReviews,
    updateReview,
    deleteReview,
    reportReview,
    markHelpful,
    getAdminReviews,
    updateReviewStatus,
} = require("../controllers/review");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public (but usually we want to show reviews to everyone)
router.route("/course/:courseId/reviews").get(getCourseReviews);

// Protected (Student)
router.route("/course/:courseId/review").post(isAuthenticatedUser, createReview);
router.route("/review/:reviewId").put(isAuthenticatedUser, updateReview).delete(isAuthenticatedUser, deleteReview);
router.route("/review/:reviewId/report").post(isAuthenticatedUser, reportReview);
router.route("/review/:reviewId/helpful").post(isAuthenticatedUser, markHelpful);

// Admin
router.route("/admin/reviews").get(isAuthenticatedUser, authorizeRoles("admin"), getAdminReviews);
router.route("/admin/review/:reviewId/status").put(isAuthenticatedUser, authorizeRoles("admin"), updateReviewStatus);

module.exports = router;
