const express = require("express");
const router = express.Router();
const {
  getVapidPublicKey,
  subscribePush,
  unsubscribePush,
  sendTestPush,
  broadcastPush,
  getPushStats,
  getBroadcastLogs,
} = require("../controllers/push");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Optional auth middleware helper for guest/logged-in support
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization || req.cookies.token) {
    return isAuthenticatedUser(req, res, next);
  }
  next();
};

// Public Push routes
router.get("/vapid-key", getVapidPublicKey);
router.post("/subscribe", optionalAuth, subscribePush);
router.post("/unsubscribe", unsubscribePush);
router.post("/test", optionalAuth, sendTestPush);

// Admin-only Push routes
router.post(
  "/admin/broadcast",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  broadcastPush
);
router.get(
  "/admin/stats",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getPushStats
);
router.get(
  "/admin/logs",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getBroadcastLogs
);

module.exports = router;
