const Review = require("../models/Review");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Helper to update course rating
const updateCourseRating = async (courseId) => {
    const reviews = await Review.find({ course: courseId, status: "Published" });
    const numOfReviews = reviews.length;

    let avgRating = 0;
    if (numOfReviews > 0) {
        avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;
    }

    await Course.findByIdAndUpdate(courseId, {
        rating: avgRating,
        numOfReviews,
    });
};

// Create Review
exports.createReview = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        // Check Enrollment (Optional but recommended)
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId, status: "active" });
        if (!enrollment && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "You must be enrolled to review this course." });
        }

        // Create Review
        const review = await Review.create({
            user: userId,
            course: courseId,
            rating: Number(rating),
            comment,
        });

        await updateCourseRating(courseId);

        res.status(201).json({ success: true, review });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "You have already reviewed this course." });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Course Reviews (Public)
exports.getCourseReviews = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const reviews = await Review.find({ course: courseId, status: "Published" })
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Review.countDocuments({ course: courseId, status: "Published" });

        res.status(200).json({
            success: true,
            reviews,
            total,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Review
exports.updateReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        let review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        if (review.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        review.rating = rating;
        review.comment = comment;
        review.status = "Published"; // Re-publish or set to Pending if moderation needed on edit
        await review.save();

        await updateCourseRating(review.course);

        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete Review
exports.deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const courseId = review.course;
        await review.deleteOne();

        await updateCourseRating(courseId);

        res.status(200).json({ success: true, message: "Review deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Report Review
exports.reportReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { reason } = req.body;

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        // Check if already reported by this user
        const alreadyReported = review.reports.find(r => r.user.toString() === req.user.id);
        if (alreadyReported) {
            return res.status(400).json({ success: false, message: "You already reported this review" });
        }

        review.reports.push({
            user: req.user.id,
            reason,
        });

        await review.save();

        res.status(200).json({ success: true, message: "Review reported" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark Helpful
exports.markHelpful = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        const index = review.helpful.indexOf(req.user.id);
        if (index === -1) {
            review.helpful.push(req.user.id);
        } else {
            review.helpful.splice(index, 1);
        }

        await review.save();
        res.status(200).json({ success: true, helpfulCount: review.helpful.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Get All Reviews (Moderation)
exports.getAdminReviews = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const reviews = await Review.find(filter)
            .populate("user", "name email")
            .populate("course", "title")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin: Update Status
exports.updateReviewStatus = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { status } = req.body; // Published, Rejected

        const review = await Review.findById(reviewId);
        if (!review) return res.status(404).json({ success: false, message: "Review not found" });

        review.status = status;
        await review.save();

        await updateCourseRating(review.course);

        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
