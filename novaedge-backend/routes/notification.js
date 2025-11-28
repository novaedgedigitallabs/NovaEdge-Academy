const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markRead,
    markAllRead,
    updatePreferences,
    broadcastNotification,
} = require("../controllers/notification");

const { isAuthenticatedUser } = require("../middleware/auth");
const { authorizeRoles } = require("../middleware/admin");

// User Routes
router.route("/notifications").get(isAuthenticatedUser, getNotifications);
router.route("/notifications/read-all").put(isAuthenticatedUser, markAllRead);
router.route("/notifications/:id/read").put(isAuthenticatedUser, markRead);
router.route("/user/preferences/notifications").put(isAuthenticatedUser, updatePreferences);

// Admin Routes
router.route("/admin/notifications/broadcast").post(isAuthenticatedUser, authorizeRoles("admin"), broadcastNotification);

module.exports = router;
