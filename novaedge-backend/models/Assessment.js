const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  // 1. Which course does this quiz belong to?
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // 2. Optional: Which specific lesson is this for?
  // (e.g., Quiz after Video #5)
  lessonId: {
    type: String,
  },

  // 3. Quiz Title
  title: {
    type: String,
    required: true,
    default: "Course Assessment",
  },

  // 4. The Questions List
  questions: [
    {
      questionText: {
        type: String,
        required: true,
      },
      // The 4 options (e.g., ["A", "B", "C", "D"])
      options: [
        {
          type: String,
          required: true,
        },
      ],
      // The correct answer index (0, 1, 2, or 3)
      correctAnswerIndex: {
        type: Number,
        required: true,
      },
    },
  ],

  // 5. How much do they need to score to pass?
  passingPercentage: {
    type: Number,
    default: 70, // Student needs 70% to pass
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Assessment", assessmentSchema);
