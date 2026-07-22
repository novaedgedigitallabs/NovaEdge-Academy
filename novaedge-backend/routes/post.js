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

router.post("/create", isAuthenticatedUser, createPost);
router.get("/all", getAllPosts);
router.get("/user/:id", getUserPosts);
router.put("/:id/like", isAuthenticatedUser, likePost);
router.put("/update/:id", isAuthenticatedUser, updatePost);
router.put("/:id/update", isAuthenticatedUser, updatePost);
router.post("/update/:id", isAuthenticatedUser, updatePost);
router.post("/:id/update", isAuthenticatedUser, updatePost);

router.get("/:id", getPostById);
router.put("/:id", isAuthenticatedUser, updatePost);
router.post("/:id", isAuthenticatedUser, updatePost);
router.delete("/:id", isAuthenticatedUser, deletePost);

module.exports = router;
