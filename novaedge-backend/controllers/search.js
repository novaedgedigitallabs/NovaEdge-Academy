const Course = require("../models/Course");
const Blog = require("../models/Blog");
const Mentor = require("../models/Mentor");
const User = require("../models/User");

// 1. Global Search
exports.globalSearch = async (req, res) => {
    try {
        const { q, type, page = 1, limit = 10 } = req.query;

        if (!q) {
            return res.status(400).json({ success: false, message: "Query parameter 'q' is required" });
        }

        const skip = (page - 1) * limit;
        const regex = new RegExp(q, "i"); // Fallback for partial matches if text search misses

        // Define search promises based on type filter
        const searchPromises = [];

        // Search Courses
        if (!type || type === "course" || type === "lecture") {
            searchPromises.push(
                Course.find(
                    { $text: { $search: q } },
                    { score: { $meta: "textScore" } }
                )
                    .select("title description poster category slug lectures price instructorNames")
                    .sort({ score: { $meta: "textScore" } })
                    .lean()
                    .then(results => results.map(r => ({ ...r, type: "course" })))
            );
        }

        // Search Blogs
        if (!type || type === "blog") {
            searchPromises.push(
                Blog.find(
                    { $text: { $search: q } },
                    { score: { $meta: "textScore" } }
                )
                    .select("title content image slug tags author")
                    .sort({ score: { $meta: "textScore" } })
                    .lean()
                    .then(results => results.map(r => ({ ...r, type: "blog" })))
            );
        }

        // Search Mentors
        if (!type || type === "mentor") {
            searchPromises.push(
                Mentor.find(
                    { $text: { $search: q } },
                    { score: { $meta: "textScore" } }
                )
                    .select("name bio image role skills expertise")
                    .sort({ score: { $meta: "textScore" } })
                    .lean()
                    .then(results => results.map(r => ({ ...r, type: "mentor" })))
            );
        }

        // Search Users (by username or name)
        if (!type || type === "user") {
            // Users might not have text index, so we use regex for username/name
            // Or we can rely on text index if we add one. Let's assume regex for now as it's safer without migration
            // But to match the Promise.all structure with scoring, we'll fake the score or use a different query structure.
            // Actually, let's just use regex find and map to same structure.
            searchPromises.push(
                User.find({
                    $or: [
                        { name: regex },
                        { username: regex }
                    ]
                })
                    .select("name username avatar role bio") // Added bio if it exists, or we use something else
                    .limit(limit)
                    .lean()
                    .then(results => results.map(r => ({ ...r, type: "user", score: 1 }))) // Give default score
            );
        }

        const resultsArray = await Promise.all(searchPromises);
        let allResults = resultsArray.flat();

        // Sort combined results by score
        allResults.sort((a, b) => b.score - a.score);

        // Manual Pagination
        const total = allResults.length;
        const paginatedResults = allResults.slice(skip, skip + parseInt(limit));

        res.status(200).json({
            success: true,
            count: total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: paginatedResults,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Autocomplete / Suggestions
exports.autocomplete = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(200).json({ success: true, suggestions: [] });

        const regex = new RegExp(q, "i");
        const limit = 5;

        const [courses, blogs, mentors, users] = await Promise.all([
            Course.find({ title: regex }).select("title slug").limit(limit).lean(),
            Blog.find({ title: regex }).select("title slug").limit(limit).lean(),
            Mentor.find({ name: regex }).select("name _id").limit(limit).lean(),
            User.find({ $or: [{ name: regex }, { username: regex }] }).select("name username _id").limit(limit).lean(),
        ]);

        const suggestions = [
            ...courses.map(c => ({ text: c.title, type: "course", id: c.slug })),
            ...blogs.map(b => ({ text: b.title, type: "blog", id: b.slug })),
            ...mentors.map(m => ({ text: m.name, type: "mentor", id: m._id })),
            ...users.map(u => ({ text: u.username ? `@${u.username} (${u.name})` : u.name, type: "user", id: u._id })),
        ].slice(0, 10); // Limit total suggestions

        res.status(200).json({ success: true, suggestions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
