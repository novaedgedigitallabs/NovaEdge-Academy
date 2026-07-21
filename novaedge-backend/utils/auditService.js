const AuditLog = require("../models/AuditLog");

class AuditService {
    /**
     * Log an action
     * @param {Object} actor - The user performing the action (req.user)
     * @param {String} action - Action name (e.g., "COURSE_UPDATE")
     * @param {Object} target - { type: "Course", id: "...", label: "..." }
     * @param {Object} before - State before change (optional)
     * @param {Object} after - State after change (optional)
     * @param {Object} req - Express request object (for IP/UserAgent)
     */
    static async log(actor, action, target, before = null, after = null, req = null) {
        try {
            const metadata = {};
            if (req) {
                metadata.ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                metadata.userAgent = req.headers["user-agent"];
            }

            // Redact sensitive fields
            const sanitizedBefore = this.redact(before);
            const sanitizedAfter = this.redact(after);

            await AuditLog.create({
                actor: actor._id,
                action,
                target,
                changes: {
                    before: sanitizedBefore,
                    after: sanitizedAfter,
                },
                metadata,
            });
        } catch (error) {
            console.error("Audit Logging Failed:", error);
            // We don't want to crash the main flow if logging fails, 
            // but in high-compliance envs, we might want to throw.
        }
    }

    static redact(obj) {
        if (!obj) return null;
        const sensitiveFields = ["password", "token", "secret", "creditCard"];

        // Deep copy to avoid mutating original
        const copy = JSON.parse(JSON.stringify(obj));

        const traverse = (o) => {
            for (const key in o) {
                if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
                    o[key] = "[REDACTED]";
                } else if (typeof o[key] === "object" && o[key] !== null) {
                    traverse(o[key]);
                }
            }
        };

        traverse(copy);
        return copy;
    }
}

module.exports = AuditService;
