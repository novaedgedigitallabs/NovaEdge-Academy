// models/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  // 1. Basic Info
  title: {
    type: String,
    required: [true, "Please enter course title"],
    minLength: [4, "Title must be at least 4 characters"],
    maxLength: [80, "Title cannot exceed 80 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter course description"],
    minLength: [20, "Description must be at least 20 characters"],
  },

  // 2. Who is teaching this? (Admin name)
  createdBy: {
    type: String,
    required: [true, "Enter creator name"],
  },

  // 3. The Course Category (Strict list from your requirements)
  category: {
    type: String,
    required: [true, "Please select category"],
    enum: [
      "App Development",
      "Software Development",
      "Game Development",
      "UI/UX Design",
      "Frontend Development",
      "Backend Development",
      "Full Stack Development",
      "Data Structures & Algorithms",
    ],
  },

  // 4. Course Level
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },

  // 5. Price (0 means free)
  price: {
    type: Number,
    required: [true, "Please enter course price"],
    default: 0,
  },

  // 6. The Thumbnail Image (Poster)
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  // NEW: Tech stack (comma separated or array of strings)
  techStack: {
    type: [String],
    default: [],
  },

  // NEW: Short prerequisites text
  prerequisites: {
    type: String,
    default: "",
  },

  // 7. THE CONTENT (List of Videos)
  lectures: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      // Video from Cloudinary
      video: {
        public_id: {
          type: String,
          // required: true, // Not required for YouTube links
        },
        url: {
          type: String,
          required: true,
        },
      },
      // Duration (optional, for display like "10 mins")
      duration: {
        type: Number, // in minutes
        default: 0,
      },
      // PDF Notes (optional)
      notes: {
        public_id: String,
        url: String,
      },
    },
  ],

  // 8. Stats (Auto-calculated later)
  views: {
    type: Number,
    default: 0,
  },
  numOfVideos: {
    type: Number,
    default: 0,
  },

  // Total Course Duration (Auto-calculated)
  duration: {
    type: String,
    default: "0 min",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
