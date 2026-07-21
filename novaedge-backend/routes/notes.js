const express = require("express");
const router = express.Router();

const {
    generateNotes,
    getNotes,
    updateNotes,
} = require("../controllers/notes");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// Public/Student Routes
router.route("/notes/:courseId/:lectureId").get(isAuthenticatedUser, getNotes);

// Admin/Instructor Routes
router.route("/notes/generate/:courseId/:lectureId").post(isAuthenticatedUser, authorizeRoles("admin"), generateNotes);
router.route("/notes/:courseId/:lectureId").put(isAuthenticatedUser, authorizeRoles("admin"), updateNotes);

module.exports = router;
