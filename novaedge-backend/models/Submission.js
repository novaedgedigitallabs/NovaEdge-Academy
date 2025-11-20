const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  // 1. Who submitted it? (Link to User)
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 2. Which course is this for? (Link to Course)
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // 3. Which specific lesson or assignment ID is this?
  // (This usually matches the ID inside the Course content array)
  lessonId: {
    type: String,
    required: true,
  },

  // 4. The actual work (e.g., GitHub link, Google Drive link, or Live URL)
  submissionLink: {
    type: String,
    required: [true, "Please provide a link to your work (GitHub/Live URL)"],
  },

  // 5. Optional: If they uploaded a file (Screenshot/PDF) via Cloudinary
  attachment: {
    public_id: {
      type: String,
    },
    url: {
      type: String,
    },
  },

  // 6. Current status of the homework
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },

  // 7. Instructor's marking area
  grade: {
    type: Number,
    min: 0,
    max: 100,
  },

  instructorFeedback: {
    type: String,
    default: "No feedback yet.",
  },

  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
