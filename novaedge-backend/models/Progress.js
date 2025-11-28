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

  // 3. Detailed Progress for each lecture
  lectureProgress: [
    {
      lectureId: { type: String, required: true },
      completed: { type: Boolean, default: false },
      lastPositionSec: { type: Number, default: 0 },
      watchedDurationSec: { type: Number, default: 0 },
      updatedAt: { type: Date, default: Date.now },
    },
  ],

  // 4. The Progress Bar number (0 to 100)
  percentComplete: {
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
