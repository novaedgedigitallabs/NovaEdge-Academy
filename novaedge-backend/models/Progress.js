const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  // 1. The Student
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 2. The Course they are watching
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // 3. List of Lesson IDs that are finished
  // We store IDs like ["lesson_1", "lesson_2"]
  completedLessons: [
    {
      type: String,
    },
  ],

  // 4. The Progress Bar number (0 to 100)
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  // 5. Are they fully done? (Triggers Certificate generation)
  isCompleted: {
    type: Boolean,
    default: false,
  },

  // 6. When did they last watch a video?
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

// --- PRO TIP ---
// This line ensures a user can only have ONE progress document per course.
// No duplicates allowed!
progressSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
