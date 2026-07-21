const Notification = require("../models/Notification");
const User = require("../models/User");
const NotificationService = require("../utils/notificationService");

// Get My Notifications
exports.getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Notification.countDocuments({ user: req.user.id });
        const unreadCount = await Notification.countDocuments({ user: req.user.id, isRead: false });

        res.status(200).json({
            success: true,
            notifications,
            total,
            unreadCount,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark Single Read
exports.markRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) return res.status(404).json({ success: false, message: "Not found" });

        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Mark All Read
exports.markAllRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user.id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Preferences
exports.updatePreferences = async (req, res) => {
    try {
        const { email, sms, push } = req.body;
        const user = await User.findById(req.user.id);

        if (email !== undefined) user.notificationPreferences.email = email;
        if (sms !== undefined) user.notificationPreferences.sms = sms;
        if (push !== undefined) user.notificationPreferences.push = push;

        await user.save();

        res.status(200).json({ success: true, preferences: user.notificationPreferences });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin Broadcast
exports.broadcastNotification = async (req, res) => {
    try {
        const { message, title, link, type } = req.body;

        // Find all users (or filter by role/course if needed)
        // For now, broadcast to ALL users
        const users = await User.find({}, "_id");
        const userIds = users.map(u => u._id);

        // Run in background (don't await loop completion for response)
        NotificationService.broadcast(userIds, { message, title, link, type: type || "system" });

        res.status(200).json({ success: true, message: "Broadcast started" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
