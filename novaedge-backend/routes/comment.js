const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    addComment,
    getComments,
    deleteComment,
    likeComment
} = require("../controllers/comment");

router.route("/add").post(isAuthenticatedUser, addComment);
router.route("/post/:postId").get(getComments);
router.route("/:id").delete(isAuthenticatedUser, deleteComment);
router.route("/:id/like").put(isAuthenticatedUser, likeComment);

module.exports = router;
