const Post = require("../models/Post");
const User = require("../models/User");

// 1. Create a Post
exports.createPost = async (req, res) => {
    try {
        const { content, repostOf } = req.body;

        const post = await Post.create({
            content,
            user: req.user.id,
            repostOf: repostOf || null,
        });

        // Populate user details for immediate display
        await post.populate("user", "name avatar username");
        if (repostOf) {
            await post.populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username"
                }
            });
        }

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get All Posts (Feed)
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name avatar username")
            .populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get User's Posts
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.id })
            .populate("user", "name avatar username")
            .populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username"
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Delete Post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        // Check if user is owner or admin
        if (post.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({ success: false, message: "Not authorized to delete this post" });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: "Post deleted",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Like/Unlike Post
exports.likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        if (post.likes.includes(req.user.id)) {
            // Unlike
            const index = post.likes.indexOf(req.user.id);
            post.likes.splice(index, 1);
            await post.save();
            return res.status(200).json({ success: true, message: "Post unliked", likes: post.likes });
        } else {
            // Like
            post.likes.push(req.user.id);
            await post.save();
            return res.status(200).json({ success: true, message: "Post liked", likes: post.likes });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
