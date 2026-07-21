const LiveClass = require("../models/LiveClass");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

// Create/Schedule Live Class (Admin/Mentor)
exports.createLiveClass = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, startTime, endTime, provider, meetingLink } = req.body;

        const liveClass = await LiveClass.create({
            course: courseId,
            title,
            description,
            startTime,
            endTime,
            provider,
            meetingLink,
        });

        // TODO: Send notifications to enrolled students

        res.status(201).json({ success: true, liveClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Live Classes for Course
exports.getLiveClasses = async (req, res) => {
    try {
        const { courseId } = req.params;
        const classes = await LiveClass.find({ course: courseId }).sort({ startTime: 1 });
        res.status(200).json({ success: true, classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Live Class (Join)
exports.getLiveClass = async (req, res) => {
    try {
        const { liveId } = req.params;
        const userId = req.user.id;

        const liveClass = await LiveClass.findById(liveId).populate("course", "title");
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        // Check Enrollment
        const enrollment = await Enrollment.findOne({ user: userId, course: liveClass.course._id, status: "active" });
        if (!enrollment && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not enrolled" });
        }

        res.status(200).json({ success: true, liveClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Status (Start/Complete/Cancel)
exports.updateLiveClassStatus = async (req, res) => {
    try {
        const { liveId } = req.params;
        const { status } = req.body;

        const liveClass = await LiveClass.findById(liveId);
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        liveClass.status = status;
        await liveClass.save();

        res.status(200).json({ success: true, liveClass });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Handle Recording Upload (Webhook or Manual)
exports.uploadRecording = async (req, res) => {
    try {
        const { liveId } = req.params;
        const { recordingUrl } = req.body;

        const liveClass = await LiveClass.findById(liveId);
        if (!liveClass) return res.status(404).json({ success: false, message: "Class not found" });

        liveClass.recordingUrl = recordingUrl;
        liveClass.status = "completed";
        await liveClass.save();

        // Auto-add to Course Lectures
        const course = await Course.findById(liveClass.course);
        if (course) {
            course.lectures.push({
                title: `Recording: ${liveClass.title}`,
                description: liveClass.description || "Live class recording",
                video: {
                    url: recordingUrl,
                    public_id: `live_${liveId}`, // Placeholder
                },
            });
            course.numOfVideos = course.lectures.length;
            await course.save();
        }

        res.status(200).json({ success: true, message: "Recording uploaded and added to lectures" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get User's Live Schedule (Calendar)
exports.getMySchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find all courses user is enrolled in
        const enrollments = await Enrollment.find({ user: userId, status: "active" });
        const courseIds = enrollments.map(e => e.course);

        // Find upcoming live classes for these courses
        const classes = await LiveClass.find({
            course: { $in: courseIds },
            startTime: { $gte: new Date() } // Future only
        }).populate("course", "title").sort({ startTime: 1 });

        res.status(200).json({ success: true, classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
