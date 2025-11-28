const AuditLog = require("../models/AuditLog");
const AuditService = require("../utils/auditService");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Get all audit logs
// @route   GET /api/v1/admin/audit
// @access  Private (Admin)
exports.getAuditLogs = asyncHandler(async (req, res, next) => {
    const { action, targetType, targetId, actorId, startDate, endDate } = req.query;

    const query = {};

    if (action) query.action = action;
    if (targetType) query["target.type"] = targetType;
    if (targetId) query["target.id"] = targetId;
    if (actorId) query.actor = actorId;

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await AuditLog.countDocuments(query);

    const logs = await AuditLog.find(query)
        .populate("actor", "name email role")
        .sort("-createdAt")
        .skip(startIndex)
        .limit(limit);

    const pagination = {};
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }

    // Log this access itself!
    // We don't await this to avoid slowing down the read
    AuditService.log(
        req.user,
        "AUDIT_ACCESS",
        { type: "AuditLog", id: req.user._id, label: "Audit Query" },
        null,
        { query: req.query },
        req
    );

    res.status(200).json({
        success: true,
        count: logs.length,
        pagination,
        data: logs,
    });
});

// @desc    Get single audit log
// @route   GET /api/v1/admin/audit/:id
// @access  Private (Admin)
exports.getAuditLog = asyncHandler(async (req, res, next) => {
    const log = await AuditLog.findById(req.params.id).populate("actor", "name email role");

    if (!log) {
        return next(new ErrorResponse("Audit log not found", 404));
    }

    res.status(200).json({
        success: true,
        data: log,
    });
});

// @desc    Retract/Annotate an audit log (instead of deleting)
// @route   POST /api/v1/admin/audit/:id/retract
// @access  Private (Admin)
exports.retractAuditLog = asyncHandler(async (req, res, next) => {
    const { reason } = req.body;
    const originalLog = await AuditLog.findById(req.params.id);

    if (!originalLog) {
        return next(new ErrorResponse("Audit log not found", 404));
    }

    // Create a NEW log entry stating the retraction
    await AuditService.log(
        req.user,
        "AUDIT_RETRACTION",
        { type: "AuditLog", id: originalLog._id, label: "Log Retraction" },
        { originalAction: originalLog.action },
        { reason },
        req
    );

    res.status(200).json({
        success: true,
        message: "Retraction logged successfully",
    });
});
