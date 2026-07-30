const mongoose = require("mongoose");

const pushLogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "/icon.png",
    },
    url: {
      type: String,
      default: "/",
    },
    image: {
      type: String,
      default: "",
    },
    target: {
      type: String,
      enum: ["all", "students", "mentors", "guests"],
      default: "all",
    },
    sentCount: {
      type: Number,
      default: 0,
    },
    successCount: {
      type: Number,
      default: 0,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["broadcast", "automated", "rss", "system"],
      default: "broadcast",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PushLog", pushLogSchema);
