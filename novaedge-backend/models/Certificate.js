const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  // 1. Who earned this?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 2. For which skill?
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // 3. The Unique ID (e.g., "CERT-1234-ABCD")
  // This is crucial for the "Verify Certificate" feature.
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },

  // 4. The link to the actual PDF file (stored on Cloudinary)
  pdfUrl: {
    type: String,
    required: true,
  },

  // 5. When was it issued?
  issueDate: {
    type: Date,
    default: Date.now,
  },
});

// --- PRO TIP ---
// A student usually gets only ONE certificate per course.
certificateSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Certificate", certificateSchema);
