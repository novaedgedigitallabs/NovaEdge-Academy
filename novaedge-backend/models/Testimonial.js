const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false, // Optional, can be a general testimonial
    },
    text: {
        type: String,
        required: [true, "Please add some text"],
        maxlength: [500, "Text cannot be more than 500 characters"],
    },
    videoUrl: {
        type: String,
        required: false,
    },
    thumbnailUrl: {
        type: String,
        required: false,
    },
    publicId: {
        type: String, // Cloudinary public_id for deletion
        required: false,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isVerifiedStudent: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Testimonial", testimonialSchema);
