const express = require("express");
const router = express.Router();

const {
    createDiscussion,
    getDiscussions,
    getDiscussion,
    addComment,
    toggleUpvote,
    reportDiscussion,
} = require("../controllers/discussion");

const { isAuthenticatedUser } = require("../middleware/auth");

// Public/Student
router.route("/course/:courseId/lecture/:lectureId/discussions").get(isAuthenticatedUser, getDiscussions).post(isAuthenticatedUser, createDiscussion);
router.route("/discussion/:discussionId").get(isAuthenticatedUser, getDiscussion);
router.route("/discussion/:discussionId/comment").post(isAuthenticatedUser, addComment);
router.route("/discussion/upvote").post(isAuthenticatedUser, toggleUpvote); // Generic upvote
router.route("/discussion/:discussionId/report").post(isAuthenticatedUser, reportDiscussion);

module.exports = router;
