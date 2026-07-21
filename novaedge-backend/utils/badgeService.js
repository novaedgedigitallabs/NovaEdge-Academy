const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const User = require("../models/User");

class BadgeService {
    /**
     * Evaluate rules and award badges based on an event.
     * @param {string} userId - The user ID
     * @param {string} eventType - The event type (e.g., "COURSE_COMPLETED")
     * @param {object} eventData - Additional data (e.g., { courseId })
     */
    static async evaluateBadge(userId, eventType, eventData = {}) {
        try {
            // Find active badges matching this event type
            const badges = await Badge.find({
                isActive: true,
                "criteria.type": "EVENT",
                "criteria.event": eventType,
            });

            for (const badge of badges) {
                // Check if user already has this badge
                const exists = await UserBadge.findOne({ user: userId, badge: badge._id });
                if (exists) continue;

                // For simple event-based badges, we award immediately.
                // For threshold-based, we would check user stats here.
                // e.g. if badge is "Complete 5 Courses", we check user.completedCourses.length

                // Simple Event Logic: Award immediately if event matches
                await this.awardBadge(userId, badge._id, eventData);
            }
        } catch (error) {
            console.error("Badge Evaluation Error:", error);
        }
    }

    /**
     * Award a badge to a user.
     * @param {string} userId 
     * @param {string} badgeId 
     * @param {object} metadata 
     */
    static async awardBadge(userId, badgeId, metadata = {}) {
        try {
            const userBadge = await UserBadge.create({
                user: userId,
                badge: badgeId,
                metadata,
            });

            // TODO: Create Notification (if Notification system exists)
            console.log(`Badge awarded: User ${userId}, Badge ${badgeId}`);

            return userBadge;
        } catch (error) {
            if (error.code === 11000) {
                // Duplicate badge, ignore
                return null;
            }
            throw error;
        }
    }
}

module.exports = BadgeService;
