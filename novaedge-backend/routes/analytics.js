const express = require("express");
const router = express.Router();

const {
    recordEvent,
    getOverview,
    getCourseFunnel,
    getLectureDropoff,
} = require("../controllers/analytics");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public/Internal (Ingestion)
// Ideally protected by a simpler API key or just user auth if frontend-driven
router.route("/analytics/event").post(recordEvent);

// Admin
router.route("/admin/analytics/overview").get(isAuthenticatedUser, authorizeRoles("admin"), getOverview);
router.route("/admin/analytics/course/:courseId/funnel").get(isAuthenticatedUser, authorizeRoles("admin"), getCourseFunnel);
router.route("/admin/analytics/lecture/:lectureId/dropoff").get(isAuthenticatedUser, authorizeRoles("admin"), getLectureDropoff);

module.exports = router;
