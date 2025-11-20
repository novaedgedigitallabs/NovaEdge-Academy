const Course = require("../models/Course");
const cloudinary = require("cloudinary").v2;

// --- 1. GET ALL COURSES (Public) ---
// Used for the "Browse Courses" page
exports.getAllCourses = async (req, res) => {
  try {
    // Get category from query (e.g., ?category=App Development)
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";

    // Simple search filter
    const query = {
      title: { $regex: keyword, $options: "i" },
    };

    if (category) {
      query.category = category;
    }

    // Don't send the lecture list here to save bandwidth (select: '-lectures')
    const courses = await Course.find(query).select("-lectures");

    res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. CREATE COURSE (Admin Only) ---
exports.createCourse = async (req, res) => {
  try {
    const { title, description, category, createdBy, price } = req.body;
    const file = req.files.poster; // Provided by express-fileupload

    // 1. Upload Poster to Cloudinary
    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "lms_posters",
    });

    // 2. Create Database Entry
    await Course.create({
      title,
      description,
      category,
      createdBy,
      price,
      poster: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    res.status(201).json({
      success: true,
      message: "Course Created Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. GET COURSE LECTURES (Student Only) ---
exports.getCourseLectures = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Only increment views everytime someone opens the course
    course.views += 1;
    await course.save();

    res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 4. ADD LECTURE (Admin Only) ---
// This is the heavy hitter - uploading videos
exports.addLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.files.video;

    const course = await Course.findById(id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // 1. Upload Video to Cloudinary (Can take time for large files)
    // resource_type: "video" is crucial here!
    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "lms_lectures",
      resource_type: "video",
    });

    // 2. Add to the lectures array
    course.lectures.push({
      title,
      description,
      video: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

    // 3. Update number of videos count
    course.numOfVideos = course.lectures.length;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Lecture Added Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 5. DELETE COURSE (Admin Only) ---
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Clean up: Delete poster from Cloudinary
    await cloudinary.uploader.destroy(course.poster.public_id);

    // Clean up: Delete all videos from Cloudinary
    for (let i = 0; i < course.lectures.length; i++) {
      await cloudinary.uploader.destroy(course.lectures[i].video.public_id, {
        resource_type: "video",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: "Course Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
