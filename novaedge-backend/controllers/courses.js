// controllers/courses.js
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const cloudinary = require("cloudinary").v2;

/**
 * Helper: upload image data
 * Accepts:
 *  - filePath (server temp file path) OR
 *  - dataUrl (base64 data URL string)
 * returns { public_id, secure_url }
 */
async function uploadImage({ filePath, dataUrl, folder = "lms_posters" }) {
  if (filePath) {
    return await cloudinary.uploader.upload(filePath, { folder });
  } else if (dataUrl) {
    // Cloudinary accepts data URIs directly
    return await cloudinary.uploader.upload(dataUrl, { folder });
  } else {
    throw new Error("No image provided");
  }
}

// Helper: Calculate total duration string
function calculateTotalDuration(lectures) {
  let totalMinutes = 0;
  lectures.forEach(lec => {
    totalMinutes += (Number(lec.duration) || 0);
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

// --- 1. GET ALL COURSES (Public) ---
exports.getAllCourses = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const category = req.query.category || "";

    const query = {
      title: { $regex: keyword, $options: "i" },
    };

    if (category) {
      query.category = category;
    }

    const courses = await Course.find(query).select("-lectures").lean();

    // Calculate real active enrolled student count for each course
    const courseIds = courses.map((c) => c._id);
    const enrollmentCounts = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds }, status: "active" } },
      { $group: { _id: "$course", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    enrollmentCounts.forEach((item) => {
      countMap[item._id.toString()] = item.count;
    });

    const coursesWithStats = courses.map((c) => ({
      ...c,
      students: countMap[c._id.toString()] || 0,
      studentsEnrolled: countMap[c._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      courses: coursesWithStats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 1.5 GET COURSE DETAILS (Public) ---
exports.getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const studentCount = await Enrollment.countDocuments({ course: course._id, status: "active" });

    res.status(200).json({
      success: true,
      course: {
        ...course,
        students: studentCount,
        studentsEnrolled: studentCount,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. CREATE COURSE (Admin Only) ---
exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      createdBy,
      price,
      techStack,
      prerequisites,
    } = req.body;

    let uploadedPoster;
    if (req.files && req.files.poster) {
      const file = req.files.poster;
      uploadedPoster = await uploadImage({
        filePath: file.tempFilePath,
        folder: "lms_posters",
      });
    } else if (req.body.image) {
      uploadedPoster = await uploadImage({
        dataUrl: req.body.image,
        folder: "lms_posters",
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Poster image is required" });
    }

    let techStackArray = [];
    if (Array.isArray(techStack)) techStackArray = techStack;
    else if (typeof techStack === "string" && techStack.trim() !== "") {
      techStackArray = techStack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let lecturesData = [];
    let totalDurationStr = "0 min";

    if (req.body.lectures) {
      try {
        const parsed = typeof req.body.lectures === "string"
          ? JSON.parse(req.body.lectures)
          : req.body.lectures;

        if (Array.isArray(parsed)) {
          lecturesData = parsed.map(l => ({
            title: l.title,
            description: l.description,
            video: {
              url: l.videoUrl,
              public_id: "youtube"
            },
            duration: Number(l.duration) || 0,
            notes: l.notesUrl ? { url: l.notesUrl, public_id: "manual" } : undefined,
          }));

          totalDurationStr = calculateTotalDuration(lecturesData);
        }
      } catch (e) {
        console.error("Failed to parse lectures:", e);
      }
    }

    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      price,
      techStack: techStackArray,
      prerequisites: prerequisites || "",
      poster: {
        public_id: uploadedPoster.public_id,
        url: uploadedPoster.secure_url || uploadedPoster.url,
      },
      lectures: lecturesData,
      numOfVideos: lecturesData.length,
      duration: totalDurationStr,
    });

    res.status(201).json({
      success: true,
      message: "Course Created Successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- UPDATE COURSE (Admin Only) ---
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, category, price, techStack, prerequisites } =
      req.body;

    const course = await Course.findById(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const hasNewFile = req.files && req.files.poster;
    const hasNewDataUrl = req.body.image && req.body.image.startsWith("data:");
    if (hasNewFile || hasNewDataUrl) {
      try {
        if (course.poster && course.poster.public_id) {
          await cloudinary.uploader.destroy(course.poster.public_id);
        }
      } catch (e) {
        console.warn("Failed to delete old poster:", e.message || e);
      }

      let uploadedPoster;
      if (hasNewFile) {
        uploadedPoster = await uploadImage({
          filePath: req.files.poster.tempFilePath,
          folder: "lms_posters",
        });
      } else {
        uploadedPoster = await uploadImage({
          dataUrl: req.body.image,
          folder: "lms_posters",
        });
      }

      course.poster = {
        public_id: uploadedPoster.public_id,
        url: uploadedPoster.secure_url || uploadedPoster.url,
      };
    }

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (price !== undefined) course.price = Number(price || 0);

    if (techStack !== undefined) {
      if (Array.isArray(techStack)) course.techStack = techStack;
      else if (typeof techStack === "string") {
        course.techStack = techStack
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      } else course.techStack = [];
    }

    if (prerequisites !== undefined) course.prerequisites = prerequisites;

    if (req.body.lectures) {
      try {
        const parsed = typeof req.body.lectures === "string"
          ? JSON.parse(req.body.lectures)
          : req.body.lectures;

        if (Array.isArray(parsed)) {
          course.lectures = parsed.map(l => {
            let existingLec = null;
            if (l._id) {
              try { existingLec = course.lectures.id(l._id); } catch (e) {}
            }

            let notesData = existingLec ? existingLec.notes : undefined;
            if (l.notes && l.notes.url) {
              notesData = {
                url: l.notes.url,
                public_id: l.notes.public_id || "manual",
              };
            } else if (l.notesUrl) {
              notesData = {
                url: l.notesUrl,
                public_id: "manual",
              };
            }

            return {
              title: l.title || "Lecture",
              description: l.description || l.title || "Lecture video",
              video: {
                url: l.videoUrl || (l.video && l.video.url) || "",
                public_id: (l.video && l.video.public_id) || "youtube"
              },
              duration: Number(l.duration) || 0,
              notes: notesData || undefined,
              _id: l._id || undefined,
              currentVersion: existingLec ? existingLec.currentVersion : 1,
              aiSummary: l.aiSummary || (existingLec ? existingLec.aiSummary : undefined),
              quiz: l.quiz || (existingLec ? existingLec.quiz : undefined),
            };
          });
          course.numOfVideos = course.lectures.length;
          course.duration = calculateTotalDuration(course.lectures);
        }
      } catch (e) {
        console.error("Failed to parse lectures:", e);
      }
    }

    await course.save();

    res.status(200).json({ success: true, message: "Course updated", course });
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
exports.addLecture = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const file = req.files && req.files.video;

    const course = await Course.findById(id);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    if (!file)
      return res
        .status(400)
        .json({ success: false, message: "Video file is required" });

    const myCloud = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "lms_lectures",
      resource_type: "video",
    });

    course.lectures.push({
      title,
      description,
      video: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });

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

    if (course.poster && course.poster.public_id) {
      await cloudinary.uploader.destroy(course.poster.public_id);
    }

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

// --- 6. GET ALL CATEGORIES ---
exports.getCategories = async (req, res) => {
  try {
    const categoriesFromDb = await Course.distinct("category");
    const defaultCategories = [
      "App Development",
      "Software Development",
      "Game Development",
      "UI/UX Design",
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Data Structures & Algorithms",
    ];
    const allCategories = Array.from(
      new Set([...defaultCategories, ...categoriesFromDb].filter(Boolean))
    );
    res.status(200).json({
      success: true,
      categories: allCategories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 7. FETCH YOUTUBE PLAYLIST VIDEOS (Full Pagination Support) ---
exports.fetchYouTubePlaylist = async (req, res) => {
  try {
    const { playlistUrl, videoUrls } = req.body;
    let lectures = [];

    const urlsToProcess = [];
    if (Array.isArray(videoUrls)) {
      urlsToProcess.push(...videoUrls);
    } else if (playlistUrl && playlistUrl.includes("\n")) {
      urlsToProcess.push(...playlistUrl.split("\n"));
    }

    if (urlsToProcess.length > 0) {
      for (const line of urlsToProcess) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const videoIdMatch = trimmed.match(/(?:v=|\/embed\/|\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const videoId = videoIdMatch ? videoIdMatch[1] : null;
        let title = "Lecture";
        if (videoId) {
          try {
            const noembedRes = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
            const noembedData = await noembedRes.json();
            if (noembedData?.title) {
              title = noembedData.title;
            }
          } catch (e) {}
        }
        lectures.push({
          title,
          description: `Lecture video`,
          videoUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : trimmed,
          duration: 15,
        });
      }

      return res.status(200).json({
        success: true,
        count: lectures.length,
        lectures,
      });
    }

    if (!playlistUrl) {
      return res.status(400).json({ success: false, message: "Playlist URL, ID, or video links required" });
    }

    let playlistId = playlistUrl.trim();
    if (playlistUrl.includes("list=")) {
      const match = playlistUrl.match(/[?&]list=([^&]+)/);
      if (match && match[1]) {
        playlistId = match[1];
      }
    }

    const apiKey = process.env.YOUTUBE_API_KEY;
    if (apiKey) {
      try {
        let nextPageToken = "";
        const allItems = [];

        do {
          const pageUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ""}`;
          const apiRes = await fetch(pageUrl);
          const data = await apiRes.json();

          if (data.items && Array.isArray(data.items)) {
            allItems.push(...data.items);
          }

          nextPageToken = data.nextPageToken || "";
        } while (nextPageToken);

        if (allItems.length > 0) {
          lectures = allItems
            .map((item) => {
              const videoId = item.snippet?.resourceId?.videoId;
              return {
                title: item.snippet?.title || "Lecture",
                description: item.snippet?.description || "",
                videoUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}` : "",
                duration: 15,
              };
            })
            .filter((l) => l.videoUrl && l.title !== "Private video" && l.title !== "Deleted video");
        }
      } catch (err) {
        console.error("YouTube API Key fetch failed:", err.message);
      }
    }

    if (lectures.length === 0) {
      return res.status(400).json({
        success: false,
        message: "YOUTUBE_API_KEY environment variable is required on backend server to fetch full playlists automatically. Alternatively, you can paste video links directly (one per line).",
      });
    }

    res.status(200).json({
      success: true,
      count: lectures.length,
      lectures,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
