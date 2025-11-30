const mongoose = require("mongoose");
const Certificate = require("./models/Certificate");
const User = require("./models/User");
const Course = require("./models/Course");
const generateCertificate = require("./utils/generateCertificate");
const generateQR = require("./utils/generateQR");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const connectDB = require("./config/db");
const connectCloudinary = require("./config/cloudinary");

const regenerate = async () => {
    try {
        await connectDB();
        connectCloudinary();

        const userId = "69205d12707329c27ed83e22";
        // Find any certificate for this user
        const certificate = await Certificate.findOne({ user: userId }).populate("user").populate("course");

        if (!certificate) {
            console.log("No certificate found for this user.");
            process.exit();
        }

        console.log(`Regenerating certificate for ${certificate.user.name} - ${certificate.course.title}`);

        const uniqueId = certificate.certificateId;
        const verificationUrl = `${process.env.FRONTEND_URL}/verify/${uniqueId}`;
        const qrCodeBuffer = await generateQR(verificationUrl);

        const filePath = await generateCertificate(
            certificate.user.name,
            certificate.course.title,
            certificate.issueDate.toLocaleDateString(),
            uniqueId,
            qrCodeBuffer
        );

        console.log("PDF generated at:", filePath);

        const myCloud = await cloudinary.uploader.upload(filePath, {
            folder: "lms_certificates",
            resource_type: "raw",
            public_id: certificate.pdfUrl.split('/').pop().split('.')[0], // Try to overwrite? Or just new.
            overwrite: true
        });

        console.log("Uploaded to Cloudinary:", myCloud.secure_url);

        // Update DB
        certificate.pdfUrl = myCloud.secure_url;
        await certificate.save();

        console.log("Database updated.");
        fs.unlinkSync(filePath);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

regenerate();
