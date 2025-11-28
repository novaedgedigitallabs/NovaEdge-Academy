const Course = require("../models/Course");

exports.isCourseMentor = async (req, res, next) => {
    try {
        // 1. If user is admin, they can access everything
        if (req.user.role === "admin") {
            return next();
        }

        // 2. Check if courseId is present in params
        const { courseId } = req.params;
        if (!courseId) {
            // If no courseId in params, maybe it's in the body or query? 
            // For now, let's assume routes using this middleware MUST have :courseId
            return res.status(400).json({
                success: false,
                message: "Course ID is required for mentor verification",
            });
        }

        // 3. Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // 4. Check if user is in the mentors list
        const isMentor = course.mentors.some(
            (mentorId) => mentorId.toString() === req.user._id.toString()
        );

        if (!isMentor) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to manage this course",
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
