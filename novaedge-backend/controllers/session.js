const Session = require("../models/Session");

// 1. Get All Sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({
            user: req.user.id,
            expiresAt: { $gt: Date.now() },
            isRevoked: false
        }).sort({ lastActive: -1 });

        // Mark current session
        const sessionsWithCurrent = sessions.map(s => ({
            ...s.toObject(),
            isCurrent: req.session && s._id.toString() === req.session._id.toString()
        }));

        res.status(200).json({
            success: true,
            sessions: sessionsWithCurrent,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Revoke Session
exports.revokeSession = async (req, res) => {
    try {
        const { id } = req.params;
        const session = await Session.findOne({ _id: id, user: req.user.id });

        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        session.isRevoked = true;
        await session.save();

        res.status(200).json({ success: true, message: "Session revoked" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Revoke Other Sessions
exports.revokeOtherSessions = async (req, res) => {
    try {
        if (!req.session) {
            return res.status(400).json({ success: false, message: "Current session not found" });
        }

        await Session.updateMany(
            {
                user: req.user.id,
                _id: { $ne: req.session._id },
                isRevoked: false
            },
            { isRevoked: true }
        );

        res.status(200).json({ success: true, message: "All other sessions revoked" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
