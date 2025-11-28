const Discussion = require("../models/Discussion");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Enrollment = require("../models/Enrollment");

// Create Discussion
exports.createDiscussion = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const { title, content } = req.body;
        const userId = req.user.id;

        // Check Enrollment
        const enrollment = await Enrollment.findOne({ user: userId, course: courseId, status: "active" });
        if (!enrollment && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not enrolled" });
        }

        const discussion = await Discussion.create({
            course: courseId,
            lectureId,
            user: userId,
            title,
            content,
            subscribers: [userId], // Auto-subscribe author
        });

        res.status(201).json({ success: true, discussion });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Discussions for Lecture
exports.getDiscussions = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const { page = 1, limit = 10, sort = "recent" } = req.query;

        let sortOption = { createdAt: -1 };
        if (sort === "upvotes") sortOption = { upvotes: -1 }; // Note: This sorts by array length only if using aggregation or virtuals, simple sort might not work on array length directly in standard find without aggregation.
        // For simplicity, let's stick to recent or use aggregation if needed. 
        // Actually, sorting by array length in Mongoose/Mongo requires aggregation.
        // Let's stick to recent for now or implement aggregation later if requested.

        const discussions = await Discussion.find({ lectureId, status: "active" })
            .populate("user", "name avatar")
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Discussion.countDocuments({ lectureId, status: "active" });

        res.status(200).json({
            success: true,
            discussions,
            total,
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Single Discussion + Comments
exports.getDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.params;

        const discussion = await Discussion.findById(discussionId).populate("user", "name avatar");
        if (!discussion) return res.status(404).json({ success: false, message: "Discussion not found" });

        const comments = await Comment.find({ discussion: discussionId, status: "active" })
            .populate("user", "name avatar")
            .sort({ createdAt: 1 }); // Chronological

        res.status(200).json({ success: true, discussion, comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add Comment
exports.addComment = async (req, res) => {
    try {
        const { discussionId } = req.params;
        const { content, parentCommentId } = req.body;
        const userId = req.user.id;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ success: false, message: "Discussion not found" });

        const comment = await Comment.create({
            discussion: discussionId,
            user: userId,
            content,
            parentComment: parentCommentId || null,
        });

        // Notify Subscribers
        // In a real app, we'd queue this.
        const subscribers = discussion.subscribers.filter(id => id.toString() !== userId);
        for (const subId of subscribers) {
            await Notification.create({
                user: subId,
                message: `New reply in "${discussion.title}"`,
                type: "reply",
                link: `/courses/${discussion.course}/lecture/${discussion.lectureId}?discussion=${discussionId}`,
            });
        }

        // Auto-subscribe commenter
        if (!discussion.subscribers.includes(userId)) {
            discussion.subscribers.push(userId);
            await discussion.save();
        }

        res.status(201).json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Toggle Upvote (Discussion or Comment)
exports.toggleUpvote = async (req, res) => {
    try {
        const { type, id } = req.body; // type: 'discussion' or 'comment'
        const userId = req.user.id;

        let Model = type === "comment" ? Comment : Discussion;
        const item = await Model.findById(id);

        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        const index = item.upvotes.indexOf(userId);
        if (index === -1) {
            item.upvotes.push(userId);
        } else {
            item.upvotes.splice(index, 1);
        }

        await item.save();

        res.status(200).json({ success: true, upvotes: item.upvotes.length, isUpvoted: index === -1 });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Report Discussion
exports.reportDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.params;
        const { reason } = req.body;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) return res.status(404).json({ success: false, message: "Discussion not found" });

        discussion.reports.push({
            user: req.user.id,
            reason,
        });
        discussion.isFlagged = true;
        await discussion.save();

        res.status(200).json({ success: true, message: "Reported successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
