const Badge = require("../models/Badge");
const UserBadge = require("../models/UserBadge");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const BadgeService = require("../utils/badgeService");

// @desc    Get all available badges
// @route   GET /api/v1/badges
// @access  Public
exports.getBadges = asyncHandler(async (req, res, next) => {
    const badges = await Badge.find({ isActive: true });

    res.status(200).json({
        success: true,
        count: badges.length,
        data: badges,
    });
});

// @desc    Get my earned badges
// @route   GET /api/v1/badges/me
// @access  Private
exports.getMyBadges = asyncHandler(async (req, res, next) => {
    const userBadges = await UserBadge.find({ user: req.user.id })
        .populate("badge")
        .sort("-awardedAt");

    res.status(200).json({
        success: true,
        count: userBadges.length,
        data: userBadges,
    });
});

// @desc    Create a badge (Admin)
// @route   POST /api/v1/admin/badges
// @access  Private (Admin)
exports.createBadge = asyncHandler(async (req, res, next) => {
    const badge = await Badge.create(req.body);

    res.status(201).json({
        success: true,
        data: badge,
    });
});

// @desc    Update a badge (Admin)
// @route   PUT /api/v1/admin/badges/:id
// @access  Private (Admin)
exports.updateBadge = asyncHandler(async (req, res, next) => {
    let badge = await Badge.findById(req.params.id);

    if (!badge) {
        return next(new ErrorResponse("Badge not found", 404));
    }

    badge = await Badge.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: badge,
    });
});

// @desc    Manually award a badge (Admin)
// @route   POST /api/v1/admin/badges/:id/award
// @access  Private (Admin)
exports.awardBadgeManually = asyncHandler(async (req, res, next) => {
    const { userId } = req.body;
    const badgeId = req.params.id;

    const result = await BadgeService.awardBadge(userId, badgeId, { manual: true });

    if (!result) {
        return next(new ErrorResponse("User already has this badge", 400));
    }

    res.status(200).json({
        success: true,
        data: result,
    });
});
