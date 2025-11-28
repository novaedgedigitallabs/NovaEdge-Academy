const Transcript = require("../models/Transcript");
const Course = require("../models/Course");

// 1. Get Transcript
exports.getTranscript = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;

        const transcript = await Transcript.findOne({ courseId, lectureId });

        if (!transcript) {
            // Return empty or 404? 
            // Better to return empty segments so frontend doesn't break
            return res.status(200).json({ success: true, transcript: { segments: [] } });
        }

        res.status(200).json({ success: true, transcript });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Upload/Update Transcript (Admin)
exports.uploadTranscript = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { segments, language } = req.body;

        if (!segments || !Array.isArray(segments)) {
            return res.status(400).json({ success: false, message: "Invalid segments data" });
        }

        // Check if course/lecture exists
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const lecture = course.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

        let transcript = await Transcript.findOne({ courseId, lectureId });

        if (transcript) {
            transcript.segments = segments;
            if (language) transcript.language = language;
            await transcript.save();
        } else {
            transcript = await Transcript.create({
                courseId,
                lectureId,
                segments,
                language: language || "en",
            });
        }

        res.status(200).json({ success: true, message: "Transcript saved", transcript });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
