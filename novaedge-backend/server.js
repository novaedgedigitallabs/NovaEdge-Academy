const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");

// 1. Load Config
dotenv.config({ path: "./.env" });

// 2. Connect to Database & Cloudinary
const connectDB = require("./config/db");
const connectCloudinary = require("./config/cloudinary");

connectDB();
connectCloudinary();

// 3. Middleware (The Gatekeepers)
app.use(express.json({ limit: "50mb" })); // Parse JSON bodies (limit increased for big data)
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser()); // Parse cookies (for Auth)
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Limit
    useTempFiles: true, // Important for Cloudinary upload
  })
);

// CORS Configuration (Allow Frontend to talk to Backend)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow sending cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// 4. Import Routes
const auth = require("./routes/auth");
const courses = require("./routes/courses");
const payment = require("./routes/payment");
const enrollment = require("./routes/enrollment");
const progress = require("./routes/progress");
const certificate = require("./routes/certificate");
const assessment = require("./routes/assessment");
const admin = require("./routes/admin");

// 5. Mount Routes
// All URLs will start with /api/v1
// Example: localhost:5000/api/v1/login
app.use("/api/v1", auth);
app.use("/api/v1", courses);
app.use("/api/v1", payment);
app.use("/api/v1", enrollment);
app.use("/api/v1", progress);
app.use("/api/v1", certificate);
app.use("/api/v1", assessment);
app.use("/api/v1", admin);

// 6. Health Check (Simple test route)
app.get("/", (req, res) => {
  res.send(
    `Server is working. Click <a href="${process.env.FRONTEND_URL}">here</a> to visit frontend.`
  );
});

// 7. Start the Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// --- ERROR HANDLING FOR CRASHES ---
// If backend crashes due to unhandled error, shut down gracefully
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
