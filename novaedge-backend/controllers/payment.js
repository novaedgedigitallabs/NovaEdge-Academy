const instance = require("../config/razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

// --- 1. BUY SUBSCRIPTION (Create Order) ---
const Coupon = require("../models/Coupon");

// --- 1. BUY SUBSCRIPTION (Create Order) ---
exports.checkout = async (req, res) => {
  try {
    const { courseId, couponCode, useWallet } = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    let finalAmount = course.price;
    let discountAmount = 0;
    let couponId = null;
    let walletAmountUsed = 0;

    // 1. Coupon Logic
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      });

      if (coupon) {
        const now = new Date();
        if (now <= coupon.validUntil && now >= coupon.validFrom) {
          if (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit) {
            if (course.price >= coupon.minOrderValue) {
              if (coupon.discountType === "percentage") {
                discountAmount = (course.price * coupon.value) / 100;
                if (coupon.maxDiscountAmount) {
                  discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
                }
              } else if (coupon.discountType === "fixed") {
                discountAmount = coupon.value;
              }
              discountAmount = Math.min(discountAmount, course.price);
              finalAmount = course.price - discountAmount;
              couponId = coupon._id;
            }
          }
        }
      }
    }

    // 2. Wallet Logic
    if (useWallet && req.user.walletBalance > 0) {
      const usableWallet = Math.min(req.user.walletBalance, finalAmount);
      walletAmountUsed = usableWallet;
      finalAmount -= usableWallet;
    }

    // Ensure at least ₹1 for Razorpay if not fully covered (Razorpay min is ₹1)
    // If fully covered (finalAmount == 0), we skip Razorpay creation or handle it differently.
    // For simplicity, let's assume we always charge at least ₹1 via Razorpay unless it's 100% free.
    // If 100% free, we can bypass Razorpay order creation.

    let order = null;
    if (finalAmount > 0) {
      const options = {
        amount: Number(finalAmount * 100),
        currency: "INR",
        notes: {
          courseId: courseId,
          userId: req.user.id,
          couponCode: couponCode || "",
          walletAmountUsed: walletAmountUsed,
        }
      };
      order = await instance.orders.create(options);
    }

    res.status(200).json({
      success: true,
      order,
      course,
      discountAmount,
      walletAmountUsed,
      finalAmount,
      couponCode
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. PAYMENT VERIFICATION (The Security Check) ---
exports.paymentVerification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      couponCode // Frontend sends this back
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Fetch order from Razorpay to get actual amount paid
      const order = await instance.orders.fetch(razorpay_order_id);
      const amountPaid = order.amount / 100;
      const walletAmountUsed = Number(order.notes.walletAmountUsed) || 0;

      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ success: false, message: "Course not found" });

      let coupon = null;
      let discountAmount = 0;

      if (couponCode) {
        coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon) {
          discountAmount = course.price - amountPaid - walletAmountUsed;
          // Increment usage
          await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
        }
      }

      // A. Deduct Wallet Balance (if used)
      if (walletAmountUsed > 0) {
        const user = await User.findById(req.user.id);
        user.walletBalance -= walletAmountUsed;
        await user.save();

        await WalletTransaction.create({
          user: req.user.id,
          amount: -walletAmountUsed,
          type: "redemption",
          description: `Used for course ${course.title}`,
        });
      }

      // B. Save Payment Record
      const payment = await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        user: req.user.id,
        course: courseId,
        amount: amountPaid,
        status: "completed",
        coupon: coupon ? coupon._id : null,
        discountAmount
      });

      // C. Enroll User
      await Enrollment.create({
        user: req.user.id,
        course: courseId,
        paymentId: payment._id,
      });

      // D. Referral Reward (If first purchase)
      const referral = await Referral.findOne({ referee: req.user.id, status: "pending" });
      if (referral) {
        // Grant Reward (e.g., ₹500)
        const reward = 500;

        referral.status = "qualified";
        referral.rewardAmount = reward;
        await referral.save();

        // Credit Referrer
        const referrer = await User.findById(referral.referrer);
        referrer.walletBalance += reward;
        await referrer.save();

        await WalletTransaction.create({
          user: referrer._id,
          amount: reward,
          type: "referral_bonus",
          description: `Referral bonus for ${req.user.name}`,
        });
      }

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
