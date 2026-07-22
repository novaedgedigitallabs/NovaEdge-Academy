const Post = require("../models/Post");
const User = require("../models/User");
const Hashtag = require("../models/Hashtag");

// 1. Create a Post
exports.createPost = async (req, res) => {
    try {
        const { content, repostOf, image, location, eventDate } = req.body;

        // Extract hashtags
        const hashtags = content ? content.match(/#[a-z0-9_]+/gi) : null;
        const uniqueHashtags = hashtags ? [...new Set(hashtags.map(tag => tag.toLowerCase().replace('#', '')))] : [];

        if (uniqueHashtags.length > 10) {
            return res.status(400).json({
                success: false,
                message: "You can only add up to 10 hashtags per post"
            });
        }

        let postImageData = { public_id: "", url: "" };

        if (image && image !== "") {
            if (image.startsWith("http://") || image.startsWith("https://")) {
                postImageData = { public_id: "posts/custom_url", url: image };
            } else {
                try {
                    const cloudinary = require("cloudinary").v2;
                    const uploadRes = await cloudinary.uploader.upload(image, {
                        folder: "posts",
                    });
                    postImageData = { public_id: uploadRes.public_id, url: uploadRes.secure_url };
                } catch (imgErr) {
                    console.error("Cloudinary post image upload fallback:", imgErr.message);
                    postImageData = { public_id: "posts/upload", url: image };
                }
            }
        }

        const post = await Post.create({
            content: content || "",
            user: req.user.id,
            repostOf: repostOf || null,
            hashtags: uniqueHashtags,
            image: postImageData,
            location: location || "",
            eventDate: eventDate || "",
        });

        // Update Hashtag Stats
        if (uniqueHashtags.length > 0) {
            const bulkOps = uniqueHashtags.map(tag => ({
                updateOne: {
                    filter: { tag },
                    update: {
                        $inc: { postsCount: 1 },
                        $addToSet: { users: req.user.id },
                        $set: { lastUsed: Date.now() }
                    },
                    upsert: true
                }
            }));
            await Hashtag.bulkWrite(bulkOps);
        }

        // Populate user details for immediate display
        await post.populate("user", "name avatar username email");
        if (repostOf) {
            await post.populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username email"
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
            .populate("user", "name avatar username email")
            .populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username email"
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
            .populate("user", "name avatar username email")
            .populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username email"
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

// 5. Get Single Post
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("user", "name avatar username email")
            .populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username email"
                }
            });

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. Like/Unlike Post
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

// 7. Update Post
exports.updatePost = async (req, res) => {
    try {
        const { content } = req.body;
        const postId = req.params.id;

        if (!postId || postId === "undefined" || postId === "null") {
            return res.status(400).json({ success: false, message: "Invalid post ID" });
        }

        let post;
        try {
            post = await Post.findById(postId);
        } catch (err) {
            return res.status(404).json({ success: false, message: "Post not found or invalid ID" });
        }

        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const userIdStr = (req.user._id || req.user.id || "").toString();
        const postUserIdStr = (post.user._id || post.user || "").toString();

        if (postUserIdStr !== userIdStr && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Unauthorized to edit this post" });
        }

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: "Post content cannot be empty" });
        }

        // Re-extract hashtags
        const hashtags = content.match(/#[a-z0-9_]+/gi);
        const uniqueHashtags = hashtags ? [...new Set(hashtags.map(tag => tag.toLowerCase().replace('#', '')))] : [];

        post.content = content.trim();
        post.hashtags = uniqueHashtags;
        post.isEdited = true;
        await post.save();

        await post.populate("user", "name avatar username email");

        res.status(200).json({
            success: true,
            message: "Post updated successfully",
            post
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
