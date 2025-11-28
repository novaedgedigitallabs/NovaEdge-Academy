const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // Polymorphic references
  type: {
    type: String,
    enum: ["quiz", "assignment"],
    required: true,
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },

  // For Assignments
  submissionLink: {
    type: String,
  },
  attachment: {
    public_id: String,
    url: String,
  },
  textContent: {
    type: String, // For code or text submission
  },

  // For Quizzes
  answers: [
    {
      questionIndex: Number,
      selectedOptionIndex: Number,
    },
  ],

  // Grading
  status: {
    type: String,
    enum: ["Pending", "Graded", "Rejected"],
    default: "Pending",
  },
  obtainedMarks: {
    type: Number,
    default: 0,
  },
  totalMarks: {
    type: Number,
    default: 0,
  },
  isPassed: {
    type: Boolean,
    default: false,
  },
  feedback: {
    type: String,
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
