const Assessment = require("../models/Assessment");
const Course = require("../models/Course");

// --- 1. CREATE ASSESSMENT (Admin Only) ---
exports.createAssessment = async (req, res) => {
  try {
    const { courseId, title, questions, passingPercentage } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Check if assessment already exists for this course (One quiz per course)
    // You can remove this check if you want multiple quizzes per course
    const existingAssessment = await Assessment.findOne({ course: courseId });
    if (existingAssessment) {
      return res.status(400).json({
        success: false,
        message: "An assessment already exists for this course",
      });
    }

    const assessment = await Assessment.create({
      course: courseId,
      title,
      questions,
      passingPercentage,
    });

    res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      assessment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. GET ASSESSMENT (Student - Start Quiz) ---
exports.getAssessment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const assessment = await Assessment.findOne({ course: courseId });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: "No assessment found for this course.",
      });
    }

    // Pro Tip: In a high-security app, you would loop through 'questions'
    // and remove 'correctAnswerIndex' before sending response so hackers can't see answers.

    res.status(200).json({
      success: true,
      assessment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. SUBMIT & GRADE ASSESSMENT (Student) ---
exports.submitAssessment = async (req, res) => {
  try {
    // User sends: { assessmentId: "...", userAnswers: [0, 2, 1, 0, ...] }
    // userAnswers is an array of indices (0=A, 1=B, etc.)
    const { assessmentId, userAnswers } = req.body;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    let score = 0;
    const totalQuestions = assessment.questions.length;

    // --- THE GRADING LOGIC ---
    // Loop through the real questions and compare with user's answers
    assessment.questions.forEach((question, index) => {
      // Check if user answered this question AND if it matches correct index
      if (
        userAnswers[index] !== undefined &&
        userAnswers[index] === question.correctAnswerIndex
      ) {
        score++;
      }
    });

    // Calculate Percentage
    const resultPercentage = (score / totalQuestions) * 100;

    // Did they pass?
    const isPassed = resultPercentage >= assessment.passingPercentage;

    res.status(200).json({
      success: true,
      score,
      totalQuestions,
      resultPercentage,
      isPassed,
      message: isPassed
        ? "Congratulations! You passed."
        : "You failed. Try again.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 4. DELETE ASSESSMENT (Admin) ---
exports.deleteAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res
        .status(404)
        .json({ success: false, message: "Assessment not found" });
    }

    await assessment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Assessment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
