const webPush = require("web-push");
const PushSubscription = require("../models/PushSubscription");
const PushLog = require("../models/PushLog");

// Initialize VAPID Keys with Production Fallbacks
const publicVapidKey = process.env.VAPID_PUBLIC_KEY || "BM5WWLLnEGCp8pR7lR76a8MEixuQJaWULzDZlpT6C_y71W72rjK2ZlB99zWx4cBZSOWUd0fdItSThabbfXtUpXE";
const privateVapidKey = process.env.VAPID_PRIVATE_KEY || "Kwuhh5kDDOKlnZi9UY9stKFIUMtrY-Fp5Y0GKRfDqGY";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@novaedge.in";

if (publicVapidKey && privateVapidKey) {
  try {
    webPush.setVapidDetails(vapidSubject, publicVapidKey, privateVapidKey);
  } catch (err) {
    console.error("Failed to set VAPID details:", err.message);
  }
} else {
  console.warn("VAPID keys not configured in environment variables.");
}

/**
 * Send web push notification to a single subscription
 */
const sendSinglePush = async (subscription, payload) => {
  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  };

  const payloadString = JSON.stringify(payload);

  try {
    const res = await webPush.sendNotification(pushSubscription, payloadString);
    await PushSubscription.updateOne(
      { _id: subscription._id },
      { lastUsedAt: new Date() }
    );
    return { success: true, res };
  } catch (error) {
    // 404 or 410 means subscription has expired or unsubscribed
    if (error.statusCode === 404 || error.statusCode === 410) {
      console.log(`Deactivating expired subscription ${subscription.endpoint}`);
      await PushSubscription.updateOne({ _id: subscription._id }, { active: false });
    } else {
      console.error(`Push notification error for ${subscription.endpoint}:`, error.message);
    }
    return { success: false, error: error.message };
  }
};

/**
 * Broadcast web push notification to a target segment
 */
const broadcastPushToSegment = async ({
  target = "all",
  title,
  body,
  icon = "/icon.png",
  url = "/",
  image = "",
  type = "broadcast",
  senderId = null,
}) => {
  let filter = { active: true };
  if (target === "students") {
    filter.role = { $in: ["student", "user"] };
  } else if (target === "mentors") {
    filter.role = "mentor";
  } else if (target === "guests") {
    filter.role = "guest";
  }

  const subscriptions = await PushSubscription.find(filter);

  const payload = {
    title,
    body,
    icon,
    url,
    image,
    timestamp: Date.now(),
    badge: "/icon.png",
  };

  let successCount = 0;
  let failureCount = 0;

  // Execute in batches of 25 to prevent event loop blocking
  const BATCH_SIZE = 25;
  for (let i = 0; i < subscriptions.length; i += BATCH_SIZE) {
    const batch = subscriptions.slice(i, i + BATCH_SIZE);
    const results = await Promise.all(
      batch.map((sub) => sendSinglePush(sub, payload))
    );

    results.forEach((res) => {
      if (res.success) successCount++;
      else failureCount++;
    });
  }

  // Create log entry
  const logEntry = await PushLog.create({
    title,
    body,
    icon,
    url,
    image,
    target,
    sentCount: subscriptions.length,
    successCount,
    failureCount,
    type,
    sender: senderId,
  });

  return {
    totalSent: subscriptions.length,
    successCount,
    failureCount,
    log: logEntry,
  };
};

module.exports = {
  publicVapidKey,
  sendSinglePush,
  broadcastPushToSegment,
};
