const Blog = require('../models/Blog');

// @desc    Get all blog posts
// @route   GET /api/v1/blogs
// @access  Public
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Blog.find({ isActive: true }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single blog post
// @route   GET /api/v1/blogs/:id
// @access  Public
exports.getPost = async (req, res, next) => {
    try {
        const post = await Blog.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create new blog post
// @route   POST /api/v1/blogs
// @access  Private (Admin)
exports.createPost = async (req, res, next) => {
    try {
        const post = await Blog.create(req.body);

        res.status(201).json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update blog post
// @route   PUT /api/v1/blogs/:id
// @access  Private (Admin)
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Blog.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with id of ${req.params.id}`
            });
        }

        post = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete blog post
// @route   DELETE /api/v1/blogs/:id
// @access  Private (Admin)
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Blog.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with id of ${req.params.id}`
            });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
