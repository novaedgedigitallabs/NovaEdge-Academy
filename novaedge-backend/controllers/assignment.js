const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");
const Enrollment = require("../models/Enrollment");
const cloudinary = require("cloudinary");

// Create Assignment (Admin)
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

        res.status(201).json({ success: true, assignment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Assignments for Course
exports.getAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const assignments = await Assignment.find({ course: courseId });
        res.status(200).json({ success: true, assignments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit Assignment
exports.submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { submissionLink, textContent } = req.body;
        const userId = req.user.id;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found" });

        // Check Enrollment
        const enrollment = await Enrollment.findOne({ user: userId, course: assignment.course, status: "active" });
        if (!enrollment && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not enrolled" });
        }

        // Handle File Upload (if any)
        let attachment = {};
        if (req.files && req.files.file) {
            const file = req.files.file;
            const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "assignments",
                resource_type: "auto",
            });
            attachment = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const submission = await Submission.create({
            student: userId,
            course: assignment.course,
            type: "assignment",
            assignment: assignmentId,
            submissionLink,
            textContent,
            attachment,
            totalMarks: assignment.maxMarks,
            status: "Pending",
        });

        res.status(200).json({ success: true, submission });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Grade Assignment (Admin/Mentor)
exports.gradeAssignment = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { obtainedMarks, feedback, status } = req.body;

        const submission = await Submission.findById(submissionId);
        if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

        submission.obtainedMarks = obtainedMarks;
        submission.feedback = feedback;
        submission.status = status || "Graded";

        // Determine pass/fail (e.g., > 40%)
        const percentage = (obtainedMarks / submission.totalMarks) * 100;
        submission.isPassed = percentage >= 40; // Hardcoded 40% for now

        await submission.save();

        // TODO: Trigger notification to user

        res.status(200).json({ success: true, submission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
