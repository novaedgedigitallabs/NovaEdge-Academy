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

        // 1. Retrieve Context (Mock RAG)
        // Find notes for this course
        const notes = await LectureNote.find({ courseId: session.course });

        // Simple Keyword Search
        const keywords = message.toLowerCase().split(" ").filter(w => w.length > 3);
        let relevantNotes = notes.filter(n =>
            keywords.some(k => n.summary.toLowerCase().includes(k) || n.keyPoints.some(kp => kp.toLowerCase().includes(k)))
        );

        // If current lecture is provided, prioritize it
        if (currentLectureId) {
            const currentNote = notes.find(n => n.lectureId === currentLectureId);
            if (currentNote) {
                relevantNotes = [currentNote, ...relevantNotes.filter(n => n.lectureId !== currentLectureId)];
            }
        }

        // Fetch Lecture Titles for citations
        const course = await Course.findById(session.course);
        const context = relevantNotes.slice(0, 3).map(n => {
            const lec = course.lectures.id(n.lectureId);
            return {
                lectureId: n.lectureId,
                title: lec ? lec.title : "Unknown Lecture",
                summary: n.summary,
                keyPoints: n.keyPoints
            };
        });

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
