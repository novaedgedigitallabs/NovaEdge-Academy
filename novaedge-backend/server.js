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
app.use((req, res, next) => {
  // Skip express-fileupload for Drive uploads (uses multer)
  if (req.path === "/api/v1/uploads/drive") {
    next();
  } else {
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB Limit
      useTempFiles: true, // Important for Cloudinary upload
    })(req, res, next);
  }
});

// CORS Configuration (Allow Frontend to talk to Backend)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      // In development, allow any origin to facilitate testing from network IPs
      return callback(null, true);
    },
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
const upload = require("./routes/upload");
const contact = require("./routes/contact");
const career = require("./routes/career");
const blog = require("./routes/blog");
const mentor = require("./routes/mentor");
const hashtag = require("./routes/hashtag"); // Added by instruction

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
app.use("/api/v1/admin", admin);
app.use("/api/v1/admin/audit", require("./routes/audit"));
app.use("/api/v1/testimonials", require("./routes/testimonials"));
app.use("/api/v1/badges", require("./routes/badges"));
app.use("/api/v1", upload);
app.use("/api/v1", contact);
app.use("/api/v1/careers", career);
app.use("/api/v1/blogs", blog);
app.use("/api/v1/mentor", mentor);
app.use("/api/v1", require("./routes/quiz"));
app.use("/api/v1", require("./routes/assignment"));
app.use("/api/v1", require("./routes/certificate"));
app.use("/api/v1", require("./routes/wishlist"));
app.use("/api/v1", require("./routes/review"));
app.use("/api/v1", require("./routes/discussion"));
app.use("/api/v1", require("./routes/liveClass"));
app.use("/api/v1", require("./routes/notification"));
app.use("/api/v1", require("./routes/coupon"));
app.use("/api/v1", require("./routes/subscription"));
app.use("/api/v1", require("./routes/referral"));
app.use("/api/v1", require("./routes/analytics"));
app.use("/api/v1", require("./routes/analytics"));
app.use("/api/v1", require("./routes/lectureVersion"));
app.use("/api/v1", require("./routes/recommendation"));
app.use("/api/v1", require("./routes/notes"));
app.use("/api/v1", require("./routes/chat"));
app.use("/api/v1", require("./routes/transcript"));
app.use("/api/v1", require("./routes/search"));
app.use("/api/v1/support", require("./routes/support"));
app.use("/api/v1", require("./routes/twoFactor"));
app.use("/api/v1/ai", require("./routes/ai"));
app.use("/api/v1/friends", require("./routes/friend"));
app.use("/api/v1/messages", require("./routes/message"));
app.use("/api/v1/posts", require("./routes/post"));
app.use("/api/v1/comments", require("./routes/comment"));
app.use("/api/v1", require("./routes/driveUpload"));
app.use("/api/v1/hashtag", hashtag);
app.use(require("./middleware/error"));


// 6. Health Check (Simple test route)
app.get("/", (req, res) => {
  res.send(
    `Server is working. Click <a href="${process.env.FRONTEND_URL}">here</a> to visit frontend.`
  );
});

// 7. Start the Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

// --- ERROR HANDLING FOR CRASHES ---
// If backend crashes due to unhandled error, shut down gracefully
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection");
  server.close(() => {
    process.exit(1);
  });
});
