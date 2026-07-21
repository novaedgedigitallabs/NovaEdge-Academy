const LectureNote = require("../models/LectureNote");
const Course = require("../models/Course");
const { generateLectureContent } = require("../utils/llmService");

// 1. Generate Notes (Trigger Job)
exports.generateNotes = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;

        // Check if notes already exist
        let note = await LectureNote.findOne({ courseId, lectureId });
        if (note) {
            return res.status(200).json({ success: true, message: "Notes already exist", note });
        }

        // Fetch Lecture Details
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        const lecture = course.lectures.id(lectureId);
        if (!lecture) return res.status(404).json({ success: false, message: "Lecture not found" });

        // Call LLM Service
        const generatedContent = await generateLectureContent(lecture.title, lecture.description);

        // Save to DB
        note = await LectureNote.create({
            courseId,
            lectureId,
            summary: generatedContent.summary,
            keyPoints: generatedContent.keyPoints,
            mcqs: generatedContent.mcqs,
            status: "approved", // Auto-approve for now
        });

        res.status(201).json({ success: true, message: "Notes generated successfully", note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get Notes
exports.getNotes = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const note = await LectureNote.findOne({ courseId, lectureId });

        if (!note) {
            return res.status(404).json({ success: false, message: "Notes not found" });
        }

        res.status(200).json({ success: true, note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Approve/Update Notes (Instructor)
exports.updateNotes = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { summary, keyPoints, mcqs, status } = req.body;

        let note = await LectureNote.findOne({ courseId, lectureId });
        if (!note) return res.status(404).json({ success: false, message: "Notes not found" });

        if (summary) note.summary = summary;
        if (keyPoints) note.keyPoints = keyPoints;
        if (mcqs) note.mcqs = mcqs;
        if (status) note.status = status;

        await note.save();

        res.status(200).json({ success: true, message: "Notes updated", note });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
