const express = require("express");
const router = express.Router();

// Import the Cashier (Controller Functions)
const {
  checkout,
  paymentVerification,
  getRazorpayKey,
} = require("../controllers/payment");

// Import the Guard
const { isAuthenticatedUser } = require("../middleware/auth");

// --- 1. CREATE ORDER (Buy Now Click) ---
// URL: /api/v1/payment/checkout
router.route("/payment/checkout").post(isAuthenticatedUser, checkout);

// --- 2. VERIFY PAYMENT (After Bank Transaction) ---
// URL: /api/v1/payment/verification
router
  .route("/payment/verification")
  .post(isAuthenticatedUser, paymentVerification);

// --- 3. GET KEY ID (Frontend Setup) ---
// URL: /api/v1/payment/razorpaykey
router.route("/payment/razorpaykey").get(isAuthenticatedUser, getRazorpayKey);

module.exports = router;
