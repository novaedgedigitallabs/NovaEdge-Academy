const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const {
    createPost,
    getAllPosts,
    getUserPosts,
    getPostById,
    deletePost,
    updatePost,
    likePost
} = require("../controllers/post");

router.route("/create").post(isAuthenticatedUser, createPost);
router.route("/all").get(getAllPosts);
router.route("/user/:id").get(getUserPosts);
router.route("/:id/like").put(isAuthenticatedUser, likePost);
router.route("/update/:id").put(isAuthenticatedUser, updatePost);
router.route("/:id/update").put(isAuthenticatedUser, updatePost);

router
    .route("/:id")
    .get(getPostById)
    .put(isAuthenticatedUser, updatePost)
    .delete(isAuthenticatedUser, deletePost);

module.exports = router;
