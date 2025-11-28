const Quiz = require("../models/Quiz");
const Submission = require("../models/Submission");
const Enrollment = require("../models/Enrollment");

// Create Quiz (Admin)
exports.createQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, questions, passingPercentage } = req.body;

        const quiz = await Quiz.create({
            course: courseId,
            title,
            description,
            questions,
            passingPercentage,
        });

        res.status(201).json({ success: true, quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Quizzes for Course
exports.getQuizzes = async (req, res) => {
    try {
        const { courseId } = req.params;
        const quizzes = await Quiz.find({ course: courseId });

        // If student, maybe hide answers? 
        // For now, we send full object but frontend should handle display.
        // Ideally, we map and remove correctAnswerIndex.
        const sanitizedQuizzes = quizzes.map(q => {
            const obj = q.toObject();
            if (req.user.role !== 'admin') {
                obj.questions.forEach(ques => delete ques.correctAnswerIndex);
            }
            return obj;
        });

        res.status(200).json({ success: true, quizzes: sanitizedQuizzes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Submit Quiz (Auto-grade)
exports.submitQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { answers } = req.body; // [{ questionIndex: 0, selectedOptionIndex: 1 }]
        const userId = req.user.id;

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

        // Check Enrollment
        const enrollment = await Enrollment.findOne({ user: userId, course: quiz.course, status: "active" });
        if (!enrollment && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not enrolled" });
        }

        let obtainedMarks = 0;
        let totalMarks = 0;

        quiz.questions.forEach((q, idx) => {
            totalMarks += q.marks || 1;
            const userAnswer = answers.find(a => a.questionIndex === idx);
            if (userAnswer && userAnswer.selectedOptionIndex === q.correctAnswerIndex) {
                obtainedMarks += q.marks || 1;
            }
        });

        const percentage = (obtainedMarks / totalMarks) * 100;
        const isPassed = percentage >= quiz.passingPercentage;

        const submission = await Submission.create({
            student: userId,
            course: quiz.course,
            type: "quiz",
            quiz: quizId,
            answers,
            obtainedMarks,
            totalMarks,
            isPassed,
            status: "Graded",
        });

        res.status(200).json({
            success: true,
            submission,
            result: {
                obtainedMarks,
                totalMarks,
                percentage,
                isPassed,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Quiz Result
exports.getQuizResult = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user.id;

        const submission = await Submission.findOne({ quiz: quizId, student: userId }).sort({ submittedAt: -1 });

        if (!submission) {
            return res.status(404).json({ success: false, message: "No submission found" });
        }

        res.status(200).json({ success: true, submission });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
