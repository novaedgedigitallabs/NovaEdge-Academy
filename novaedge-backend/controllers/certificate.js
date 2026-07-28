const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const User = require("../models/User");
const Progress = require("../models/Progress");

const generateCertificate = require("../utils/generateCertificate");
const generateQR = require("../utils/generateQR");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const crypto = require("crypto");

// --- 1. GENERATE CERTIFICATE (Student Trigger) ---
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // A. Check if Certificate already exists
    let certificate = await Certificate.findOne({ user: userId, course: courseId });
    if (certificate) {
      return res.status(200).json({ success: true, certificate, message: "Certificate already exists" });
    }

    // B. Check completion
    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress || progress.percentComplete < 100) {
      return res.status(400).json({ success: false, message: "You have not completed this course yet." });
    }

    // C. Fetch User and Course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    // D. Generate Unique Certificate ID
    const uniqueId = `CERT-${courseId.slice(-4)}-${userId.slice(-4)}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // E. Build web certificate URL (instant — no file generation needed)
    const certUrl = `${process.env.FRONTEND_URL || "https://www.novaedgeacademy.in"}/certificate/${uniqueId}`;

    // F. Save to Database
    certificate = await Certificate.create({
      user: userId,
      course: courseId,
      certificateId: uniqueId,
      pdfUrl: certUrl,
    });

    res.status(201).json({ success: true, certificate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. GET MY CERTIFICATES ---
exports.getMyCertificates = async (req, res) => {
  try {
    const allCertificates = await Certificate.find({ user: req.user.id })
      .populate("course", "title");

    res.status(200).json({
      success: true,
      certificates: allCertificates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. VERIFY CERTIFICATE (Public/Employer Route) ---
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

// --- 3. ADMIN GENERATE CERTIFICATE ---
exports.adminGenerateCertificate = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    // A. Check if Certificate already exists
    let certificate = await Certificate.findOne({ user: userId, course: courseId });
    if (certificate) {
      return res.status(200).json({
        success: true,
        certificate,
        message: "Certificate already exists for this user and course",
      });
    }

    // B. Fetch User and Course details
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ success: false, message: "User or Course not found" });
    }

    // C. Generate Unique Certificate ID
    const uniqueId = `CERT-${courseId.slice(-4)}-${userId.slice(-4)}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // D. Web-based certificate URL (instant — no file generation, no Drive upload)
    const certUrl = `${process.env.FRONTEND_URL || "https://www.novaedgeacademy.in"}/certificate/${uniqueId}`;

    // E. Save to Database
    certificate = await Certificate.create({
      user: userId,
      course: courseId,
      certificateId: uniqueId,
      pdfUrl: certUrl,
    });

    res.status(201).json({
      success: true,
      certificate,
      message: "Certificate generated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 4. GET USER CERTIFICATES (Public/Profile) ---
exports.getUserCertificates = async (req, res) => {
  try {
    const { userId } = req.params;

    const certificates = await Certificate.find({ user: userId })
      .populate("course", "title image")
      .populate("user", "name avatar");

    res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 5. DOWNLOAD CERTIFICATE (Direct PDF Streaming) ---
exports.downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params; // Certificate ID (e.g., CERT-...)

    const certificate = await Certificate.findOne({ certificateId: id })
      .populate("user", "name")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    const verificationUrl = `${process.env.FRONTEND_URL || "https://www.novaedgeacademy.in"}/verify/${id}`;
    let qrCodeBuffer = null;
    try {
      qrCodeBuffer = await generateQR(verificationUrl);
    } catch (e) {
      console.error("QR Code Error:", e);
    }

    const issueDate = certificate.createdAt
      ? new Date(certificate.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })
      : new Date().toLocaleDateString("en-IN", { dateStyle: "medium" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="certificate-${id}.pdf"`);

    const { streamCertificatePDF } = require("../utils/generateCertificate");
    streamCertificatePDF(res, {
      studentName: certificate.user?.name || "Student",
      courseName: certificate.course?.title || "Course",
      date: issueDate,
      certificateId: id,
      qrCodeBuffer,
    });
  } catch (error) {
    console.error("Download Certificate Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// --- 6. ADMIN GET ALL CERTIFICATES ---
exports.getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("user", "name email avatar")
      .populate("course", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, certificates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 7. ADMIN DELETE / REVOKE CERTIFICATE ---
exports.adminDeleteCertificate = async (req, res) => {
  try {
    const { id } = req.params; // Accepts Mongo _id or certificateId string
    const certificate = await Certificate.findOneAndDelete({
      $or: [{ _id: id }, { certificateId: id }]
    });

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.status(200).json({
      success: true,
      message: "Certificate deleted / revoked successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
