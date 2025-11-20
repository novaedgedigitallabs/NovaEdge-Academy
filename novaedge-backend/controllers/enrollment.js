const Enrollment = require("../models/Enrollment");


// --- 1. GET MY COURSES (Student Dashboard) ---
// This shows the student all the courses they bought
exports.myEnrollments = async (req, res) => {
  try {
    // Find all enrollments where user = logged in user
    const enrollments = await Enrollment.find({ user: req.user.id }).populate(
      "course"
    ); // <--- MAGIC: Get full course details, not just ID

    if (!enrollments) {
      return res.status(200).json({ success: true, enrollments: [] });
    }

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. CHECK SPECIFIC ENROLLMENT (Access Control) ---
// Used when a user clicks a video. Checks if they actually own THIS course.
exports.checkEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;

    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    // If enrollment exists, accessGranted is true
    const accessGranted = enrollment ? true : false;

    res.status(200).json({
      success: true,
      accessGranted,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. GET ALL ENROLLMENTS (Admin Dashboard) ---
// Shows you a list of every sale ever made
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("user", "name email") // Show Student Name/Email
      .populate("course", "title price"); // Show Course Title/Price

    res.status(200).json({
      success: true,
      count: enrollments.length,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
