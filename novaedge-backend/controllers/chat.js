const ChatSession = require("../models/ChatSession");
const LectureNote = require("../models/LectureNote");
const Course = require("../models/Course");
const { generateChatResponse } = require("../utils/llmService");

// 1. Create/Get Session
exports.getSession = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        let session = await ChatSession.findOne({ user: userId, course: courseId });
        if (!session) {
            session = await ChatSession.create({ user: userId, course: courseId, messages: [] });
        }

        res.status(200).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { message, currentLectureId } = req.body;

        const session = await ChatSession.findById(sessionId);
        if (!session) return res.status(404).json({ success: false, message: "Session not found" });

        // 1. Retrieve Context (Real RAG)
        const course = await Course.findById(session.course);
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });

        let contextData = [];

        // If current lecture is provided, prioritize it
        if (currentLectureId) {
            const lecture = course.lectures.id(currentLectureId);
            if (lecture) {
                contextData.push({
                    type: "Current Lecture",
                    title: lecture.title,
                    content: lecture.aiSummary || lecture.description,
                    lectureId: lecture._id
                });

                // Try to fetch transcript
                // const transcript = await Transcript.findOne({ lectureId: currentLectureId });
                // if (transcript) {
                //    contextData.push({ type: "Transcript", content: transcript.segments.map(s => s.text).join(" ") });
                // }
            }
        }

        // Also add other lectures summaries if needed (simplified for now to just current lecture + course info)
        contextData.push({
            type: "Course Info",
            title: course.title,
            content: course.description
        });

        const context = contextData.map(c => ({
            title: c.title,
            text: c.content,
            lectureId: c.lectureId
        }));

        // 2. Generate Response
        const response = await generateChatResponse(message, context);

        // 3. Save History
        session.messages.push({ role: "user", content: message });
        session.messages.push({
            role: "assistant",
            content: response.text,
            citations: response.citations
        });
        session.updatedAt = Date.now();
        await session.save();

        res.status(200).json({ success: true, message: session.messages[session.messages.length - 1] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
