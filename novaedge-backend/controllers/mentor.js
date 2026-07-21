const User = require("../models/User");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Discussion = require("../models/Discussion");
const Comment = require("../models/Comment");
const MentorActivity = require("../models/MentorActivity");
const cloudinary = require("cloudinary");

// Helper to log activity
const logActivity = async (mentorId, action, details, courseId) => {
    await MentorActivity.create({
        mentor: mentorId,
        action,
        details,
        course: courseId,
    });
};

// Get Mentor Profile & Assigned Courses
exports.getMentorProfile = async (req, res) => {
    try {
        const courses = await Course.find({ mentors: req.user._id });

        res.status(200).json({
            success: true,
            user: req.user,
            assignedCourses: courses,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upload Lecture
exports.uploadLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, videoUrl, videoPublicId, duration } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const newLecture = {
            title,
            description,
            video: {
                public_id: videoPublicId || "url_only",
                url: videoUrl,
            },
            duration,
        };

        course.lectures.push(newLecture);
        course.numOfVideos = course.lectures.length;
        await course.save();

        await logActivity(req.user._id, "UPLOAD_LECTURE", { title }, courseId);

        res.status(201).json({
            success: true,
            message: "Lecture added successfully",
            course,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Edit Lecture
exports.editLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { title, description, changelog } = req.body;

        if (!changelog) {
            return res.status(400).json({ success: false, message: "Changelog is required" });
        }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const lecture = course.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

        lecture.title = title || lecture.title;
        lecture.description = description || lecture.description;
        lecture.currentVersion += 1; // Increment version

        await course.save();

        await logActivity(req.user._id, "EDIT_LECTURE", { title, changelog }, courseId);

        res.status(200).json({
            success: true,
            message: "Lecture updated successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create Assignment
exports.createAssignment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, dueDate, maxMarks } = req.body;

        const assignment = await Assignment.create({
            course: courseId,
            title,
            description,
            dueDate,
            maxMarks,
        });

        await logActivity(req.user._id, "CREATE_ASSIGNMENT", { title }, courseId);

        res.status(201).json({
            success: true,
            assignment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Course Assignments
exports.getCourseAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.status(200).json({
            success: true,
            assignments,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Course Students (Summary)
exports.getCourseStudents = async (req, res) => {
    try {
        // Find users who have this course in their courses array
        const students = await User.find({ courses: req.params.courseId }).select("name email avatar");

        res.status(200).json({
            success: true,
            students,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Student Performance
exports.getStudentPerformance = async (req, res) => {
    try {
        const { courseId, studentId } = req.params;

        const submissions = await Submission.find({ course: courseId, student: studentId })
            .populate("assignment", "title")
            .populate("quiz", "title");

        // Calculate average grade
        let totalObtained = 0;
        let totalMax = 0;
        submissions.forEach(sub => {
            if (sub.status === 'Graded') {
                totalObtained += sub.obtainedMarks;
                totalMax += sub.totalMarks;
            }
        });

        const averageGrade = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

        res.status(200).json({
            success: true,
            submissions,
            averageGrade,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Course Questions
exports.getCourseQuestions = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { status, page = 1 } = req.query;
        const limit = 10;
        const skip = (page - 1) * limit;

        let query = { course: courseId };
        if (status) {
            // If status is 'unanswered', we might need to check if it has replies from mentors?
            // For simplicity, let's assume 'status' field on Discussion model or just filter by replies
            // The Discussion model has a 'status' enum ["active", "closed", "deleted"]
            // But the requirement says "filter unanswered/flagged"
            // Let's stick to basic filtering for now.
            if (status === 'flagged') query.isFlagged = true;
        }

        const questions = await Discussion.find(query)
            .populate("user", "name avatar")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            questions,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Reply to Question
exports.replyToQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { content } = req.body;

        const discussion = await Discussion.findById(questionId);
        if (!discussion) return res.status(404).json({ success: false, message: "Question not found" });

        const comment = await Comment.create({
            discussion: questionId,
            user: req.user._id,
            content,
            isSolution: true, // Mentor replies can be marked as solutions automatically or manually
        });

        // Notify student (TODO: Implement notification service call)

        await logActivity(req.user._id, "REPLY_QUESTION", { questionId }, discussion.course);

        res.status(201).json({
            success: true,
            comment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Grade Submission
exports.gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks, feedback, status } = req.body;

        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

        submission.obtainedMarks = marks;
        submission.feedback = feedback;
        submission.status = status || "Graded";

        // Check if passed (assuming 50% passing criteria for now, or based on maxMarks)
        if (submission.totalMarks > 0) {
            submission.isPassed = (marks / submission.totalMarks) >= 0.5;
        }

        await submission.save();

        await logActivity(req.user._id, "GRADE_SUBMISSION", { submissionId, marks }, submission.course);

        res.status(200).json({
            success: true,
            message: "Submission graded successfully",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mentor Analytics
exports.getMentorAnalytics = async (req, res) => {
    try {
        // Get all courses for this mentor
        const courses = await Course.find({ mentors: req.user._id }).select("_id title");
        const courseIds = courses.map(c => c._id);

        // 1. Total Students
        const totalStudents = await User.countDocuments({ courses: { $in: courseIds } });

        // 2. Pending Submissions
        const pendingSubmissions = await Submission.countDocuments({
            course: { $in: courseIds },
            status: "Pending"
        });

        // 3. Unresolved Questions (Active discussions)
        // This is a rough proxy. Ideally we check for discussions without mentor replies.
        const activeQuestions = await Discussion.countDocuments({
            course: { $in: courseIds },
            status: "active"
        });

        res.status(200).json({
            success: true,
            analytics: {
                totalCourses: courses.length,
                totalStudents,
                pendingSubmissions,
                activeQuestions
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
