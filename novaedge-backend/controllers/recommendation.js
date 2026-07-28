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

// --- GET SUGGESTED PEERS / FRIENDS TAKING SAME COURSES ---
exports.getSuggestedPeers = async (req, res) => {
    try {
        const userId = req.user ? req.user._id || req.user.id : null;
        let currentUser = null;
        let friendsSet = new Set();

        if (userId) {
            currentUser = await User.findById(userId).select("friends");
            if (currentUser && Array.isArray(currentUser.friends)) {
                currentUser.friends.forEach(id => friendsSet.add(id.toString()));
            }
        }

        let suggestedPeers = [];

        if (userId) {
            // Find courses current user is enrolled in
            const userEnrollments = await Enrollment.find({ user: userId, status: "active" }).select("course");
            const courseIds = userEnrollments.map(e => e.course);

            if (courseIds.length > 0) {
                // Find other learners enrolled in the same courses
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
            }
        }

        // Fallback: If no peer matches or user not enrolled in courses, get active learners
        if (suggestedPeers.length < 5) {
            const excludeIds = [userId, ...Array.from(friendsSet), ...suggestedPeers.map(p => p._id)];
            const fallbackUsers = await User.find({
                _id: { $nin: excludeIds.filter(Boolean) }
            })
            .select("name username avatar role email")
            .limit(5 - suggestedPeers.length)
            .lean();

            fallbackUsers.forEach(u => {
                suggestedPeers.push({
                    _id: u._id,
                    name: u.name,
                    username: u.username || u.email?.split("@")[0],
                    avatar: u.avatar?.url,
                    reason: "Learner on NovaEdge"
                });
            });
        }

        res.status(200).json({
            success: true,
            peers: suggestedPeers.slice(0, 5),
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
