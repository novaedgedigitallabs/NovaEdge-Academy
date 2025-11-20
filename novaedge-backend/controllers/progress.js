const Progress = require("../models/Progress");
const Course = require("../models/Course");

// --- 1. UPDATE PROGRESS (Mark Video as Done) ---
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user.id;

    // A. Find the Course to know total videos
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // B. Find the Progress Document for this user & course
    let progress = await Progress.findOne({ user: userId, course: courseId });

    // If no progress exists yet (first video watched), create one
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLessons: [],
      });
    }

    // C. Add the lessonId to the list (Only if not already there)
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // D. Calculate Percentage
    // Math: (Completed Videos / Total Videos) * 100
    const totalLectures = course.lectures.length;
    const completedCount = progress.completedLessons.length;

    // Avoid division by zero if course has empty lectures
    const percentage =
      totalLectures === 0 ? 0 : (completedCount / totalLectures) * 100;

    progress.completionPercentage = Math.round(percentage); // Round to whole number (e.g., 33%)

    // E. Check if Course is fully done
    if (progress.completionPercentage === 100) {
      progress.isCompleted = true;
    }

    // F. Update "Last Accessed" date
    progress.lastAccessed = Date.now();

    await progress.save();

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. GET PROGRESS (For the Dashboard Bar) ---
exports.getProgress = async (req, res) => {
  try {
    const { courseId } = req.query; // Passed as ?courseId=...

    const progress = await Progress.findOne({
      user: req.user.id,
      course: courseId,
    });

    // If they haven't started yet, return 0 progress
    if (!progress) {
      return res.status(200).json({
        success: true,
        progress: {
          completedLessons: [],
          completionPercentage: 0,
          isCompleted: false,
        },
      });
    }

    res.status(200).json({
      success: true,
      progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
