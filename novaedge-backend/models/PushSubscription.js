const mongoose = require("mongoose");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional for guest visitors
    },
    endpoint: {
      type: String,
      required: true,
      unique: true,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
    role: {
      type: String,
      enum: ["user", "student", "mentor", "admin", "guest"],
      default: "guest",
    },
    deviceInfo: {
      type: String,
      default: "Unknown Device",
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookup by user and active status
pushSubscriptionSchema.index({ user: 1, active: 1 });

module.exports = mongoose.model("PushSubscription", pushSubscriptionSchema);
