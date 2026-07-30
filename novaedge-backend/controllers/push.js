const PushSubscription = require("../models/PushSubscription");
const PushLog = require("../models/PushLog");
const { publicVapidKey, sendSinglePush, broadcastPushToSegment } = require("../utils/webPush");

// 1. Get VAPID Public Key
exports.getVapidPublicKey = async (req, res) => {
  try {
    const key = publicVapidKey || process.env.VAPID_PUBLIC_KEY || "BM5WWLLnEGCp8pR7lR76a8MEixuQJaWULzDZlpT6C_y71W72rjK2ZlB99zWx4cBZSOWUd0fdItSThabbfXtUpXE";
    res.status(200).json({
      success: true,
      publicKey: key,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Subscribe to Web Push
exports.subscribePush = async (req, res) => {
  try {
    const { subscription, deviceInfo } = req.body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription payload. Endpoint and keys required.",
      });
    }

    const userId = req.user ? req.user.id : null;
    const userRole = req.user ? req.user.role || "student" : "guest";

    let existingSub = await PushSubscription.findOne({
      endpoint: subscription.endpoint,
    });

    if (existingSub) {
      existingSub.user = userId || existingSub.user;
      existingSub.keys = subscription.keys;
      existingSub.role = userRole;
      existingSub.deviceInfo = deviceInfo || existingSub.deviceInfo;
      existingSub.active = true;
      existingSub.lastUsedAt = new Date();
      await existingSub.save();

      return res.status(200).json({
        success: true,
        message: "Subscription updated successfully",
        subscription: existingSub,
      });
    }

    const newSub = await PushSubscription.create({
      user: userId,
      endpoint: subscription.endpoint,
      keys: subscription.keys,
      role: userRole,
      deviceInfo: deviceInfo || "Browser Device",
      active: true,
    });

    res.status(201).json({
      success: true,
      message: "Subscribed to push notifications",
      subscription: newSub,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Unsubscribe from Web Push
exports.unsubscribePush = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: "Endpoint is required",
      });
    }

    await PushSubscription.updateOne(
      { endpoint },
      { active: false }
    );

    res.status(200).json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Send Test Push Notification
exports.sendTestPush = async (req, res) => {
  try {
    const { subscription } = req.body;

    let subToUse = null;

    if (subscription && subscription.endpoint) {
      subToUse = subscription;
    } else if (req.user) {
      subToUse = await PushSubscription.findOne({
        user: req.user.id,
        active: true,
      }).sort({ updatedAt: -1 });
    }

    if (!subToUse) {
      return res.status(404).json({
        success: false,
        message: "No active push subscription found to send test notification.",
      });
    }

    const testPayload = {
      title: "⚡ NovaEdge Push Test",
      body: "Web Push Notifications are active and working smoothly!",
      icon: "/icon.png",
      url: "/admin/push-notifications",
      timestamp: Date.now(),
    };

    const result = await sendSinglePush(subToUse, testPayload);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Test push notification delivered!",
      });
    } else {
      res.status(500).json({
        success: false,
        message: `Failed to deliver push notification: ${result.error}`,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Broadcast Push (Admin Feature)
exports.broadcastPush = async (req, res) => {
  try {
    const { title, body, icon, url, image, target } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        success: false,
        message: "Title and body are required for broadcast.",
      });
    }

    const result = await broadcastPushToSegment({
      target: target || "all",
      title,
      body,
      icon: icon || "/icon.png",
      url: url || "/",
      image: image || "",
      type: "broadcast",
      senderId: req.user ? req.user.id : null,
    });

    res.status(200).json({
      success: true,
      message: `Broadcast completed. Sent: ${result.totalSent}, Success: ${result.successCount}, Failed: ${result.failureCount}`,
      result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Get Push Subscription Stats (Admin)
exports.getPushStats = async (req, res) => {
  try {
    const totalSubscribers = await PushSubscription.countDocuments({ active: true });
    const studentsCount = await PushSubscription.countDocuments({
      active: true,
      role: { $in: ["student", "user"] },
    });
    const mentorsCount = await PushSubscription.countDocuments({
      active: true,
      role: "mentor",
    });
    const guestsCount = await PushSubscription.countDocuments({
      active: true,
      role: "guest",
    });

    const logs = await PushLog.find().sort({ createdAt: -1 }).limit(10);

    const totalSent = logs.reduce((acc, log) => acc + (log.sentCount || 0), 0);
    const totalSuccess = logs.reduce((acc, log) => acc + (log.successCount || 0), 0);
    const successRate = totalSent > 0 ? ((totalSuccess / totalSent) * 100).toFixed(1) : 100;

    res.status(200).json({
      success: true,
      stats: {
        totalSubscribers,
        studentsCount,
        mentorsCount,
        guestsCount,
        totalSent,
        successRate,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Get Broadcast Logs (Admin)
exports.getBroadcastLogs = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const logs = await PushLog.find()
      .populate("sender", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await PushLog.countDocuments();

    res.status(200).json({
      success: true,
      logs,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
