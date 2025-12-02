const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    createPost,
    getAllPosts,
    getUserPosts,
    deletePost,
    likePost
} = require("../controllers/post");

router.route("/create").post(isAuthenticatedUser, createPost);
router.route("/all").get(getAllPosts); // Public feed? Or protected? Let's make it public for now or authenticated? Usually feed is for logged in users, but home page might be public. Let's keep it open for now but maybe frontend will hide create if not logged in.
router.route("/user/:id").get(getUserPosts);
router.route("/:id").delete(isAuthenticatedUser, deletePost);
router.route("/:id/like").put(isAuthenticatedUser, likePost);

module.exports = router;
