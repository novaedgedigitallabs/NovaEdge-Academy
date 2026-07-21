const Testimonial = require("../models/Testimonial");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment"); // Assuming this exists, or check via User/Course
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const cloudinary = require("cloudinary").v2;

// @desc    Create a testimonial
// @route   POST /api/v1/testimonials
// @access  Private
exports.createTestimonial = asyncHandler(async (req, res, next) => {
    const { text, courseId } = req.body;
    let videoUrl = null;
    let thumbnailUrl = null;
    let publicId = null;

    // Handle Video Upload
    if (req.files && req.files.video) {
        const file = req.files.video;

        // Upload to Cloudinary (resource_type: video)
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "video",
            folder: "lms_testimonials",
        });

        videoUrl = result.secure_url;
        publicId = result.public_id;
        // Generate a thumbnail from the video
        thumbnailUrl = result.secure_url.replace(/\.[^/.]+$/, ".jpg");
    }

    // Check if verified student
    let isVerifiedStudent = false;
    if (courseId) {
        // Check if user is enrolled in this course
        // Note: Adjust this check based on your actual Enrollment model/logic
        // For now, let's assume we check the user's enrolledCourses array if it exists, 
        // or query the Enrollment collection.
        // Let's try querying Enrollment collection if it exists, otherwise skip.
        try {
            const Enrollment = require("../models/Enrollment");
            const enrollment = await Enrollment.findOne({ user: req.user.id, course: courseId });
            if (enrollment) isVerifiedStudent = true;
        } catch (e) {
            // Ignore if model doesn't exist yet
        }
    }

    const testimonial = await Testimonial.create({
        user: req.user.id,
        course: courseId,
        text,
        videoUrl,
        thumbnailUrl,
        publicId,
        isVerifiedStudent,
        status: "pending", // Always pending initially
    });

    res.status(201).json({
        success: true,
        data: testimonial,
    });
});

// @desc    Get all approved testimonials (Public)
// @route   GET /api/v1/testimonials
// @access  Public
exports.getTestimonials = asyncHandler(async (req, res, next) => {
    const { courseId, featured } = req.query;
    const query = { status: "approved" };

    if (courseId) query.course = courseId;
    if (featured === "true") query.isFeatured = true;

    const testimonials = await Testimonial.find(query)
        .populate("user", "name avatar")
        .populate("course", "title")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials,
    });
});

// @desc    Get all testimonials (Admin)
// @route   GET /api/v1/admin/testimonials
// @access  Private (Admin)
exports.getAdminTestimonials = asyncHandler(async (req, res, next) => {
    const testimonials = await Testimonial.find()
        .populate("user", "name email")
        .populate("course", "title")
        .sort("-createdAt");

    res.status(200).json({
        success: true,
        count: testimonials.length,
        data: testimonials,
    });
});

// @desc    Update testimonial status (Approve/Reject/Feature)
// @route   PUT /api/v1/admin/testimonials/:id
// @access  Private (Admin)
exports.updateTestimonial = asyncHandler(async (req, res, next) => {
    let testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
        return next(new ErrorResponse("Testimonial not found", 404));
    }

    const { status, isFeatured, text } = req.body;

    if (status) testimonial.status = status;
    if (isFeatured !== undefined) testimonial.isFeatured = isFeatured;
    if (text) testimonial.text = text;

    await testimonial.save();

    res.status(200).json({
        success: true,
        data: testimonial,
    });
});

// @desc    Delete testimonial
// @route   DELETE /api/v1/admin/testimonials/:id
// @access  Private (Admin)
exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
        return next(new ErrorResponse("Testimonial not found", 404));
    }

    // Delete video from Cloudinary if exists
    if (testimonial.publicId) {
        await cloudinary.uploader.destroy(testimonial.publicId, { resource_type: "video" });
    }

    await testimonial.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});
