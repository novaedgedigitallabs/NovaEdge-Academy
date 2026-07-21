const Hashtag = require("../models/Hashtag");
const Post = require("../models/Post");

// Get Hashtag Data (Stats + Posts)
exports.getHashtagData = async (req, res) => {
    try {
        const { tag } = req.params;
        const normalizedTag = tag.toLowerCase();

        const hashtag = await Hashtag.findOne({ tag: normalizedTag });

        // Fetch posts containing the hashtag (case-insensitive regex)
        // Note: In a real large-scale app, we'd use the `hashtags` array in Post model for filtering
        const posts = await Post.find({ hashtags: normalizedTag })
            .populate("user", "name avatar username")
            .populate({
                path: "repostOf",
                populate: {
                    path: "user",
                    select: "name avatar username"
                }
            })
            .sort({ createdAt: -1 });

        // Calculate Impressions (Sum of views of these posts)
        const impressions = posts.reduce((acc, post) => acc + (post.views || 0), 0);

        // Stats
        const stats = {
            postsCount: hashtag ? hashtag.postsCount : posts.length,
            usersCount: hashtag ? hashtag.users.length : 0, // Approximate unique users
            clicks: hashtag ? hashtag.clicks : 0,
            impressions: impressions,
            ctr: impressions > 0 ? ((hashtag ? hashtag.clicks : 0) / impressions * 100).toFixed(2) : 0
        };

        res.status(200).json({
            success: true,
            stats,
            posts
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Track Hashtag Click
exports.trackHashtagClick = async (req, res) => {
    try {
        const { tag } = req.body;
        if (!tag) return res.status(400).json({ success: false, message: "Tag is required" });

        const normalizedTag = tag.toLowerCase().replace('#', '');

        await Hashtag.findOneAndUpdate(
            { tag: normalizedTag },
            { $inc: { clicks: 1 } },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get Trending Hashtags (Optional helper)
exports.getTrendingHashtags = async (req, res) => {
    try {
        const hashtags = await Hashtag.find()
            .sort({ postsCount: -1 })
            .limit(5);

        res.status(200).json({ success: true, hashtags });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
