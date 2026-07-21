const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const AnalyticsEvent = require("../models/AnalyticsEvent");

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
            // Find courses in same categories or matching tags
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
                if (userCategories.has(c.category)) score += 5; // Category match
                score += calculateTagSimilarity(c.techStack, userTagsArray) * 10; // Tag overlap
                score += (c.rating || 0); // Quality boost
                c.score = score;
                c.reason = "Based on your interests";
            });

            // --- STRATEGY B: Collaborative Filtering (Co-occurrence) ---
            // "Users who bought what you bought, also bought..."
            if (enrolledCourseIds.length > 0) {
                // Find other users who enrolled in same courses
                const peerEnrollments = await Enrollment.find({
                    course: { $in: enrolledCourseIds },
                    user: { $ne: userId }
                }).limit(100); // Limit sample size for performance

                const peerUserIds = [...new Set(peerEnrollments.map(e => e.user))];

                // Find what ELSE they bought
                const peerOtherEnrollments = await Enrollment.find({
                    user: { $in: peerUserIds },
                    course: { $nin: enrolledCourseIds } // Exclude what I already have
                });

                // Count frequency
                const freqMap = {};
                peerOtherEnrollments.forEach(e => {
                    const cId = e.course.toString();
                    freqMap[cId] = (freqMap[cId] || 0) + 1;
                });

                // Boost scores of content candidates or add new ones
                for (const [cId, count] of Object.entries(freqMap)) {
                    const existing = contentCandidates.find(c => c._id.toString() === cId);
                    if (existing) {
                        existing.score += (count * 2); // Boost
                        existing.reason = "Popular among similar learners";
                    } else {
                        // Fetch if not in content candidates (rare if category is different, but possible)
                        // For simplicity, we skip fetching new ones to save DB calls, 
                        // or we could fetch top 3 collaborative misses.
                    }
                }
            }

            // Sort and Slice
            recommendations = contentCandidates
                .sort((a, b) => b.score - a.score)
                .slice(0, Number(limit));

        }

        // 2. Fallback: Popular / Trending (Cold Start)
        if (recommendations.length < Number(limit)) {
            const popular = await Course.find({
                _id: { $nin: [...excludeCourseIds, ...recommendations.map(r => r._id)] }
            })
                .sort({ views: -1, rating: -1 }) // Most viewed & rated
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
