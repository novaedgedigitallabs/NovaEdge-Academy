const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  // 1. Razorpay Order ID (Created before user pays)
  razorpay_order_id: {
    type: String,
    required: true,
  },

  // 2. Razorpay Payment ID (Received AFTER user pays)
  razorpay_payment_id: {
    type: String,
  },

  // 3. Razorpay Signature (To prove the payment is fake or real)
  razorpay_signature: {
    type: String,
  },

  // 4. Who paid?
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 5. What did they buy?
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // 6. How much? (Stored in Rupees, not Paise, to avoid confusion)
  amount: {
    type: Number,
    required: true,
  },

  // 7. Status of money
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
