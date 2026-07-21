const express = require("express");
const router = express.Router();

const {
    createLectureVersion,
    getLectureVersions,
    rollbackLectureVersion,
} = require("../controllers/lectureVersion");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Admin Routes
router.route("/admin/course/:courseId/lecture/:lectureId/version").post(isAuthenticatedUser, authorizeRoles("admin"), createLectureVersion);
router.route("/admin/course/:courseId/lecture/:lectureId/versions").get(isAuthenticatedUser, authorizeRoles("admin"), getLectureVersions);
router.route("/admin/lecture-version/:versionId/rollback").post(isAuthenticatedUser, authorizeRoles("admin"), rollbackLectureVersion);

module.exports = router;
