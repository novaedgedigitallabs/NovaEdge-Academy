const express = require("express");
const router = express.Router();

const {
    createLiveClass,
    getLiveClasses,
    getLiveClass,
    updateLiveClassStatus,
    uploadRecording,
    getMySchedule,
} = require("../controllers/liveClass.js");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public/Student
router.route("/course/:courseId/live").get(isAuthenticatedUser, getLiveClasses);
router.route("/live/:liveId").get(isAuthenticatedUser, getLiveClass);
router.route("/user/live/calendar").get(isAuthenticatedUser, getMySchedule);

// Admin/Mentor
router.route("/course/:courseId/live").post(isAuthenticatedUser, authorizeRoles("admin"), createLiveClass);
router.route("/live/:liveId/status").put(isAuthenticatedUser, authorizeRoles("admin"), updateLiveClassStatus);
router.route("/live/:liveId/recording").post(isAuthenticatedUser, authorizeRoles("admin"), uploadRecording);

module.exports = router;
