const AnalyticsEvent = require("../models/AnalyticsEvent");
const Payment = require("../models/Payment");
const User = require("../models/User");
const Course = require("../models/Course");

// 1. Record Event (Ingestion)
exports.recordEvent = async (req, res) => {
    try {
        const { type, courseId, lectureId, meta } = req.body;

        // Basic validation
        if (!type) return res.status(400).json({ success: false, message: "Type required" });

        await AnalyticsEvent.create({
            type,
            userId: req.user ? req.user.id : null, // Optional if public event
            courseId,
            lectureId,
            meta,
        });

        res.status(200).json({ success: true });
    } catch (error) {
        // Don't block the client if analytics fails, just log it
        console.error("Analytics Error:", error);
        res.status(200).json({ success: true }); // Pretend success
    }
};

// 2. Get Overview (Admin)
exports.getOverview = async (req, res) => {
    try {
        const { range = 30 } = req.query; // Days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - range);

        // A. Revenue (from Payments)
        const revenueData = await Payment.aggregate([
            { $match: { status: "completed", createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    total: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // B. New Users (from Users)
        const newUsersData = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // C. Active Users (from AnalyticsEvents)
        // Count unique users per day
        const activeUsersData = await AnalyticsEvent.aggregate([
            { $match: { createdAt: { $gte: startDate }, userId: { $ne: null } } },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        user: "$userId"
                    },
                },
            },
            {
                $group: {
                    _id: "$_id.date",
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // KPI Totals (Last 24h)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const revenue24h = await Payment.aggregate([
            { $match: { status: "completed", createdAt: { $gte: yesterday } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const newUsers24h = await User.countDocuments({ createdAt: { $gte: yesterday } });
        const activeUsers24h = await AnalyticsEvent.distinct("userId", { createdAt: { $gte: yesterday } });

        res.status(200).json({
            success: true,
            revenue: revenueData,
            newUsers: newUsersData,
            activeUsers: activeUsersData,
            kpi: {
                revenue24h: revenue24h[0]?.total || 0,
                newUsers24h,
                activeUsers24h: activeUsers24h.length,
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get Course Funnel
exports.getCourseFunnel = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Views
        const views = await AnalyticsEvent.countDocuments({
            type: "page_view",
            courseId
        });

        // Checkouts Started
        const checkouts = await AnalyticsEvent.countDocuments({
            type: "checkout_start",
            courseId
        });

        // Purchases (from Payments for accuracy)
        const purchases = await Payment.countDocuments({
            course: courseId,
            status: "completed"
        });

        res.status(200).json({
            success: true,
            funnel: [
                { name: "Views", value: views },
                { name: "Checkout", value: checkouts },
                { name: "Purchases", value: purchases },
            ],
            conversionRate: views > 0 ? ((purchases / views) * 100).toFixed(2) : 0,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Get Lecture Drop-off (Heatmap data)
exports.getLectureDropoff = async (req, res) => {
    try {
        const { lectureId } = req.params;

        // Aggregate progress events
        // Assuming meta.progress is percentage (0-100)
        const data = await AnalyticsEvent.aggregate([
            { $match: { type: "lecture_progress", lectureId } },
            {
                $bucket: {
                    groupBy: "$meta.progress",
                    boundaries: [0, 25, 50, 75, 100],
                    default: "other",
                    output: {
                        count: { $sum: 1 }
                    }
                }
            }
        ]);

        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
