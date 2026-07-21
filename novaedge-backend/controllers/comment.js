const Comment = require("../models/Comment");
const Post = require("../models/Post");

// 1. Add Comment
exports.addComment = async (req, res) => {
    try {
        const { content, postId, parentId } = req.body;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const comment = await Comment.create({
            content,
            post: postId,
            user: req.user.id,
            parent: parentId || null,
        });

        await comment.populate("user", "name avatar username");

        res.status(201).json({
            success: true,
            comment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get Comments for a Post
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate("user", "name avatar username")
            .sort({ createdAt: 1 }); // Oldest first for comments usually, or newest? Let's do oldest first like a conversation.

        // We can structure them into a tree on the frontend or here.
        // For simplicity, let's return flat list and handle nesting on frontend.

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Delete Comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        // Check if user is owner or admin
        if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(401).json({ success: false, message: "Not authorized to delete this comment" });
        }

        await comment.deleteOne();

        res.status(200).json({
            success: true,
            message: "Comment deleted",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Like/Unlike Comment
exports.likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        if (comment.likes.includes(req.user.id)) {
            // Unlike
            const index = comment.likes.indexOf(req.user.id);
            comment.likes.splice(index, 1);
            await comment.save();
            return res.status(200).json({ success: true, message: "Comment unliked", likes: comment.likes });
        } else {
            // Like
            comment.likes.push(req.user.id);
            await comment.save();
            return res.status(200).json({ success: true, message: "Comment liked", likes: comment.likes });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
