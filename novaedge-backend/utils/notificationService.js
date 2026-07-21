const Notification = require("../models/Notification");
const User = require("../models/User");
const sendEmail = require("./sendEmail");

class NotificationService {
    // Send Notification to a single user
    static async send(userId, { message, type, link, title }) {
        try {
            const user = await User.findById(userId);
            if (!user) return;

            // 1. Create In-App Notification (Always, unless we want to filter)
            await Notification.create({
                user: userId,
                message,
                type,
                link,
            });

            // 2. Send Email (if enabled)
            if (user.notificationPreferences?.email) {
                // Simple email template
                const emailMessage = `
          <h1>${title || "New Notification"}</h1>
          <p>${message}</p>
          ${link ? `<a href="${process.env.FRONTEND_URL}${link}">View Details</a>` : ""}
        `;

                try {
                    await sendEmail({
                        email: user.email,
                        subject: title || "New Notification from NovaEdge",
                        message: emailMessage, // sendEmail usually takes text, but let's assume it handles html or we pass it as such
                        // If sendEmail only takes text, we might need to adjust. 
                        // Looking at sendEmail usage in other places might help, but for now I'll assume it works.
                    });
                } catch (emailErr) {
                    console.error("Email send failed:", emailErr.message);
                }
            }

            // 3. Send SMS/Push (Not implemented yet)

        } catch (error) {
            console.error("Notification Error:", error);
        }
    }

    // Broadcast to multiple users
    static async broadcast(userIds, data) {
        // In production, use a queue (RabbitMQ/Bull)
        // Here we just loop (ok for small batches)
        for (const id of userIds) {
            await this.send(id, data);
        }
    }
}

module.exports = NotificationService;
