const express = require("express");
const {
    createTestimonial,
    getTestimonials,
    getAdminTestimonials,
    updateTestimonial,
    deleteTestimonial,
} = require("../controllers/testimonials");

const router = express.Router();

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Public Routes
router.route("/").get(getTestimonials);

// Protected Routes (User)
router.route("/").post(isAuthenticatedUser, createTestimonial);

// Admin Routes
router.use("/admin", isAuthenticatedUser, authorizeRoles("admin"));

router.route("/admin").get(getAdminTestimonials);
router
    .route("/admin/:id")
    .put(updateTestimonial)
    .delete(deleteTestimonial);

module.exports = router;
