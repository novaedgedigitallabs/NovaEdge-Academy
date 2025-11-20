const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const User = require("../models/User");
const Progress = require("../models/Progress");

const generateCertificate = require("../utils/generateCertificate");
const generateQR = require("../utils/generateQR");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const crypto = require("crypto");

// --- 1. GET MY CERTIFICATE (Student Trigger) ---
exports.getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // A. Check if Certificate already exists (Don't generate twice)
    let certificate = await Certificate.findOne({
      user: userId,
      course: courseId,
    });

    if (certificate) {
      return res.status(200).json({
        success: true,
        certificate,
        message: "Certificate already exists",
      });
    }

    // B. Check if the user has actually finished the course (Anti-Cheat)
    const progress = await Progress.findOne({ user: userId, course: courseId });

    if (!progress || progress.completionPercentage < 100) {
      return res.status(400).json({
        success: false,
        message: "You have not completed this course yet.",
      });
    }

    // C. Fetch User and Course details for the PDF
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    // D. Generate Unique Certificate ID
    // Format: CERT-CourseID-UserID-RandomHex
    const uniqueId = `CERT-${courseId.slice(-4)}-${userId.slice(-4)}-${crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;

    // E. Generate QR Code
    // This URL points to your frontend verification page
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${uniqueId}`;
    const qrCodeBuffer = await generateQR(verificationUrl);

    // F. Generate PDF (Creates a file in /tmp folder)
    const filePath = await generateCertificate(
      user.name,
      course.title,
      new Date().toLocaleDateString(), // Today's date
      uniqueId,
      qrCodeBuffer
    );

    // G. Upload to Cloudinary
    const myCloud = await cloudinary.uploader.upload(filePath, {
      folder: "lms_certificates",
      resource_type: "raw", // Important for PDFs to be downloadable
    });

    // H. Delete the local temp file (Cleanup server)
    fs.unlinkSync(filePath);

    // I. Save to Database
    certificate = await Certificate.create({
      user: userId,
      course: courseId,
      certificateId: uniqueId,
      pdfUrl: myCloud.secure_url,
    });

    res.status(201).json({
      success: true,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. VERIFY CERTIFICATE (Public/Employer Route) ---
// Employer scans QR -> Frontend calls this API -> Returns validity
exports.verifyCertificate = async (req, res) => {
  try {
    const { id } = req.params; // The Certificate ID (e.g., CERT-123...)

    const certificate = await Certificate.findOne({ certificateId: id })
      .populate("user", "name email")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Invalid Certificate ID. This certificate does not exist.",
      });
    }

    res.status(200).json({
      success: true,
      valid: true,
      certificate,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
