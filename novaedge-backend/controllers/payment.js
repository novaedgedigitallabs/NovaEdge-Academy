const instance = require("../config/razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// --- 1. BUY SUBSCRIPTION (Create Order) ---
exports.checkout = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const options = {
      amount: Number(course.price * 100), // Razorpay works in Paise (₹500 = 50000 paise)
      currency: "INR",
    };

    // Ask Razorpay to create an order ID
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      course, // Sending course details back if needed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. PAYMENT VERIFICATION (The Security Check) ---
exports.paymentVerification = async (req, res) => {
  try {
    // Data sent from Frontend after successful payment
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    // Create the string that Razorpay expects: "order_id|payment_id"
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Hash it using your Secret Key
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Compare the hash you made with the signature Razorpay sent
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // A. Save Payment Record
      await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        user: req.user.id,
        course: courseId,
        amount: req.body.amount, // Optional: pass amount from front or fetch from DB
        status: "completed",
      });

      // B. Enroll User in Course (Unlock access)
      await Enrollment.create({
        user: req.user.id,
        course: courseId,
        paymentId: razorpay_payment_id, // Storing reference
      });

      // C. Redirect to Frontend Success Page
      res.redirect(
        `http://localhost:3000/payment/success?reference=${razorpay_payment_id}`
      );
    } else {
      res.status(400).json({
        success: false,
        message: "Payment Verification Failed (Invalid Signature)",
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. SEND API KEY (Frontend needs this) ---
exports.getRazorpayKey = async (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
};
