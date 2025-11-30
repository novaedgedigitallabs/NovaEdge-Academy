const Course = require("../models/Course");
const Transcript = require("../models/Transcript");
const geminiModel = require("../utils/gemini");
const ErrorHandler = require("../utils/errorResponse");
const catchAsyncErrors = require("../middleware/async");

// Generate Lecture Summary and Quiz
exports.generateLectureResources = catchAsyncErrors(async (req, res, next) => {
    const { courseId, lectureId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
        return next(new ErrorHandler("Course not found", 404));
    }

    const lecture = course.lectures.id(lectureId);
    if (!lecture) {
        return next(new ErrorHandler("Lecture not found", 404));
    }

    // Check if resources already exist
    if (lecture.aiSummary && lecture.quiz && lecture.quiz.length > 0) {
        return res.status(200).json({
            success: true,
            message: "Resources already exist",
            aiSummary: lecture.aiSummary,
            quiz: lecture.quiz,
        });
    }

    // Fetch transcript if available
    const transcriptDoc = await Transcript.findOne({ courseId, lectureId });
    let transcriptText = "";
    if (transcriptDoc && transcriptDoc.segments) {
        transcriptText = transcriptDoc.segments.map((s) => s.text).join(" ");
    }

    // Construct Prompt
    const prompt = `
    You are an AI tutor. I will provide you with the title, description, and transcript (if available) of a lecture.
    
    Lecture Title: ${lecture.title}
    Lecture Description: ${lecture.description}
    Transcript: ${transcriptText ? transcriptText.substring(0, 10000) : "Not available"}

    Please generate:
    1. A concise summary of the lecture (max 150 words).
    2. A practice quiz with 3 multiple-choice questions based on the content.
    
    Return the response in strictly valid JSON format with the following structure:
    {
      "summary": "The summary text...",
      "quiz": [
        {
          "question": "Question 1 text",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0 // Index of the correct option (0-3)
        },
        ...
      ]
    }
    Do not include any markdown formatting (like \`\`\`json). Just the raw JSON string.
  `;

    try {
        const result = await geminiModel.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown if present
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(text);

        // Update Lecture
        lecture.aiSummary = data.summary;
        lecture.quiz = data.quiz;

        await course.save();

        res.status(200).json({
            success: true,
            aiSummary: lecture.aiSummary,
            quiz: lecture.quiz,
        });
    } catch (error) {
        console.error("AI Generation Error:", error);
        return next(new ErrorHandler("Failed to generate AI resources", 500));
    }
});
