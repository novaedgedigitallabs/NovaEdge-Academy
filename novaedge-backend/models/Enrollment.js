const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  // 1. The Student who got admission
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 2. The Course they joined
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // 3. Link to the receipt (So we know which payment caused this enrollment)
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },

  // 4. Admission Date
  enrolledAt: {
    type: Date,
    default: Date.now,
  },

  // 5. Is their admission still valid?
  // Useful if you need to ban someone or if they ask for a refund.
  status: {
    type: String,
    enum: ["active", "refunded", "revoked"],
    default: "active",
  },
});

// --- PRO TIP ---
// Prevents double admission. A student cannot be enrolled in the same course twice.
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
