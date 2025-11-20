const User = require("../models/User");
const Payment = require("../models/Payment");
const Enrollment = require("../models/Enrollment");

// --- 1. GET DASHBOARD STATS (The Money Page) ---
exports.getDashboardStats = async (req, res) => {
  try {
    // A. Count Total Users
    const usersCount = await User.countDocuments();

    // B. Count Total Subscriptions (Enrollments)
    const subscriptionsCount = await Enrollment.countDocuments();

    // C. Calculate Total Revenue
    // We fetch all completed payments
    const payments = await Payment.find({ status: "completed" });

    // We use .reduce() to sum up the amounts
    // Note: Payment.amount is in Paise, so we divide by 100 to get Rupees
    const totalRevenue = payments.reduce((total, payment) => {
      return total + payment.amount / 100;
    }, 0);

    // D. Send it all back
    res.status(200).json({
      success: true,
      stats: {
        users: usersCount,
        subscriptions: subscriptionsCount,
        revenue: totalRevenue,
        paymentsCount: payments.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. GET ALL USERS ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. UPDATE USER ROLE (Promote/Demote) ---
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body; // e.g., "admin" or "user"

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 4. DELETE USER (Ban Hammer) ---
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: Clean up their image from Cloudinary here if you want
    // await cloudinary.uploader.destroy(user.avatar.public_id);

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
