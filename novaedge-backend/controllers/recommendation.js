const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const AnalyticsEvent = require("../models/AnalyticsEvent");
const User = require("../models/User");

// Helper: Calculate Jaccard Similarity for tags
function calculateTagSimilarity(courseTags, userTags) {
    if (!courseTags || !userTags) return 0;
    const intersection = courseTags.filter(t => userTags.includes(t));
    const union = new Set([...courseTags, ...userTags]);
    return intersection.length / union.size;
}

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const { limit = 5 } = req.query;

        let recommendations = [];
        let excludeCourseIds = [];

        // 1. If User is Logged In
        if (userId) {
            // Get User's Enrollments
            const enrollments = await Enrollment.find({ user: userId }).select("course");
            const enrolledCourseIds = enrollments.map(e => e.course.toString());
            excludeCourseIds = [...enrolledCourseIds];

            // Get User's Recent Views (Intent)
            const recentViews = await AnalyticsEvent.find({ userId, type: "page_view" })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("courseId");

            // Extract User Profile (Tags & Categories)
            let userCategories = new Set();
            let userTags = new Set();

            // From Enrollments
            if (enrolledCourseIds.length > 0) {
                const enrolledCourses = await Course.find({ _id: { $in: enrolledCourseIds } });
                enrolledCourses.forEach(c => {
                    userCategories.add(c.category);
                    c.techStack.forEach(t => userTags.add(t));
                });
            }

            // From Views (give less weight, but useful)
            recentViews.forEach(v => {
                if (v.courseId) {
                    userCategories.add(v.courseId.category);
                    v.courseId.techStack.forEach(t => userTags.add(t));
                }
            });

            const userTagsArray = Array.from(userTags);
            const userCategoriesArray = Array.from(userCategories);

            // --- STRATEGY A: Content-Based Filtering ---
            const contentCandidates = await Course.find({
                _id: { $nin: excludeCourseIds },
                $or: [
                    { category: { $in: userCategoriesArray } },
                    { techStack: { $in: userTagsArray } }
                ]
            }).lean();

            // Score Candidates
            contentCandidates.forEach(c => {
                let score = 0;
                if (userCategories.has(c.category)) score += 5;
                score += calculateTagSimilarity(c.techStack, userTagsArray) * 10;
                score += (c.rating || 0);
                c.score = score;
                c.reason = "Based on your interests";
            });

            // --- STRATEGY B: Collaborative Filtering ---
            if (enrolledCourseIds.length > 0) {
                const peerEnrollments = await Enrollment.find({
                    course: { $in: enrolledCourseIds },
                    user: { $ne: userId }
                }).limit(100);

                const peerUserIds = [...new Set(peerEnrollments.map(e => e.user))];

                const peerOtherEnrollments = await Enrollment.find({
                    user: { $in: peerUserIds },
                    course: { $nin: enrolledCourseIds }
                });

                const freqMap = {};
                peerOtherEnrollments.forEach(e => {
                    const cId = e.course.toString();
                    freqMap[cId] = (freqMap[cId] || 0) + 1;
                });

                for (const [cId, count] of Object.entries(freqMap)) {
                    const existing = contentCandidates.find(c => c._id.toString() === cId);
                    if (existing) {
                        existing.score += (count * 2);
                        existing.reason = "Popular among similar learners";
                    }
                }
            }

            recommendations = contentCandidates
                .sort((a, b) => b.score - a.score)
                .slice(0, Number(limit));
        }

        // 2. Fallback: Popular / Trending
        if (recommendations.length < Number(limit)) {
            const popular = await Course.find({
                _id: { $nin: [...excludeCourseIds, ...recommendations.map(r => r._id)] }
            })
                .sort({ views: -1, rating: -1 })
                .limit(Number(limit) - recommendations.length)
                .lean();

            popular.forEach(c => {
                c.reason = "Trending now";
                recommendations.push(c);
            });
        }

        res.status(200).json({
            success: true,
            recommendations,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- GET SUGGESTED PEERS / FRIENDS TAKING SAME COURSES ONLY ---
exports.getSuggestedPeers = async (req, res) => {
    try {
        const userId = req.user ? req.user._id || req.user.id : null;

        if (!userId) {
            return res.status(200).json({
                success: true,
                enrolled: false,
                peers: [],
                message: "Please login to see classmates"
            });
        }

        let currentUser = await User.findById(userId).select("friends");
        let friendsSet = new Set();
        if (currentUser && Array.isArray(currentUser.friends)) {
            currentUser.friends.forEach(id => friendsSet.add(id.toString()));
        }

        // Find courses current user is enrolled in
        const userEnrollments = await Enrollment.find({ user: userId, status: "active" }).select("course");
        const courseIds = userEnrollments.map(e => e.course);

        if (courseIds.length === 0) {
            // User is not enrolled in any course yet
            return res.status(200).json({
                success: true,
                enrolled: false,
                peers: [],
                message: "Enroll in courses to connect with classmates"
            });
        }

        // Find other learners enrolled in the EXACT SAME courses
        const peerEnrollments = await Enrollment.find({
            course: { $in: courseIds },
            user: { $ne: userId, $nin: Array.from(friendsSet) }
        })
        .populate("user", "name username avatar role email")
        .populate("course", "title")
        .limit(30);

        const peerMap = new Map();

        peerEnrollments.forEach(e => {
            if (!e.user) return;
            const pId = e.user._id.toString();
            if (!peerMap.has(pId)) {
                peerMap.set(pId, {
                    user: e.user,
                    courses: [e.course ? e.course.title : "Same Course"],
                });
            } else {
                const existing = peerMap.get(pId);
                if (e.course && !existing.courses.includes(e.course.title)) {
                    existing.courses.push(e.course.title);
                }
            }
        });

        let suggestedPeers = [];
        peerMap.forEach((val) => {
            suggestedPeers.push({
                _id: val.user._id,
                name: val.user.name,
                username: val.user.username || val.user.email?.split("@")[0],
                avatar: val.user.avatar?.url,
                reason: val.courses.length > 1 
                    ? `Enrolled in ${val.courses.length} same courses` 
                    : `Enrolled in ${val.courses[0]}`
            });
        });

        res.status(200).json({
            success: true,
            enrolled: true,
            peers: suggestedPeers.slice(0, 5),
            message: suggestedPeers.length === 0 ? "No classmates found in your enrolled courses yet" : ""
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
