const express = require("express");
const router = express.Router();

const { getTranscript, uploadTranscript } = require("../controllers/transcript");
const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

router.route("/course/:courseId/lecture/:lectureId/transcript").get(isAuthenticatedUser, getTranscript);
router.route("/course/:courseId/lecture/:lectureId/transcript").post(isAuthenticatedUser, authorizeRoles("admin"), uploadTranscript);

module.exports = router;
