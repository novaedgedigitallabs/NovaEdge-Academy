const Ticket = require("../models/Ticket");
const TicketComment = require("../models/TicketComment");
const Queue = require("../models/Queue");
const SLA = require("../models/SLA");
const AutoAssignRule = require("../models/AutoAssignRule");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

// @desc    Create a new ticket
// @route   POST /api/v1/support/tickets
// @access  Private (User/Agent/Admin)
exports.createTicket = asyncHandler(async (req, res, next) => {
    const { subject, description, priority, source, tags, metadata } = req.body;

    // Calculate SLA due date based on priority
    let slaDueAt = null;
    const sla = await SLA.findOne({ priority: priority || "medium" });
    if (sla) {
        slaDueAt = new Date(Date.now() + sla.resolutionTimeMinutes * 60000);
    }

    const ticket = await Ticket.create({
        subject,
        description,
        priority,
        source,
        requester: req.user.id,
        tags,
        metadata,
        slaDueAt,
    });

    // Auto-assignment logic (simplified)
    await autoAssignTicket(ticket);

    res.status(201).json({
        success: true,
        data: ticket,
    });
});

// @desc    Get all tickets
// @route   GET /api/v1/support/tickets
// @access  Private (Agent/Admin)
exports.getTickets = asyncHandler(async (req, res, next) => {
    let query;

    const reqQuery = { ...req.query };
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Filter by assignee if agent (unless admin viewing all)
    if (req.user.role === "agent" && !reqQuery.viewAll) {
        // Agents can see tickets assigned to them or unassigned in their queues
        // For simplicity, let's just show assigned tickets or all if admin
        // A more complex query would be needed for queue-based visibility
    }

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );

    query = Ticket.find(JSON.parse(queryStr))
        .populate("requester", "name email avatar")
        .populate("assignee", "name email avatar")
        .populate("queue", "name");

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(",").join(" ");
        query = query.sort(sortBy);
    } else {
        query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Ticket.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    const tickets = await query;

    const pagination = {};
    if (endIndex < total) {
        pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
        success: true,
        count: tickets.length,
        pagination,
        data: tickets,
    });
});

// @desc    Get single ticket
// @route   GET /api/v1/support/tickets/:id
// @access  Private
exports.getTicket = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id)
        .populate("requester", "name email avatar")
        .populate("assignee", "name email avatar")
        .populate("queue", "name");

    if (!ticket) {
        return next(
            new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
        );
    }

    // Access control: requester, assignee, or admin/agent
    // Note: requester is populated, so we check _id
    if (
        (ticket.requester && ticket.requester._id.toString() !== req.user.id) &&
        req.user.role !== "admin" &&
        req.user.role !== "agent"
    ) {
        return next(
            new ErrorResponse(`User not authorized to access this ticket`, 401)
        );
    }

    const comments = await TicketComment.find({ ticket: ticket._id })
        .populate("author", "name email avatar role")
        .sort("createdAt");

    res.status(200).json({
        success: true,
        data: ticket,
        comments,
    });
});

// @desc    Add comment to ticket
// @route   POST /api/v1/support/tickets/:id/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(
            new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
        );
    }

    const comment = await TicketComment.create({
        ticket: req.params.id,
        author: req.user.id,
        content: req.body.content,
        isInternal: req.body.isInternal || false,
        attachments: req.body.attachments,
    });

    // Update ticket updated time
    ticket.updatedAt = Date.now();
    await ticket.save();

    res.status(201).json({
        success: true,
        data: comment,
    });
});

// @desc    Update ticket status/assignee
// @route   PUT /api/v1/support/tickets/:id
// @access  Private (Agent/Admin)
exports.updateTicket = asyncHandler(async (req, res, next) => {
    let ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
        return next(
            new ErrorResponse(`Ticket not found with id of ${req.params.id}`, 404)
        );
    }

    ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: ticket,
    });
});

// @desc    Get queues
// @route   GET /api/v1/support/queues
// @access  Private (Agent/Admin)
exports.getQueues = asyncHandler(async (req, res, next) => {
    const queues = await Queue.find().populate("agents", "name email");
    res.status(200).json({
        success: true,
        data: queues,
    });
});

// @desc    Create queue
// @route   POST /api/v1/support/queues
// @access  Private (Admin)
exports.createQueue = asyncHandler(async (req, res, next) => {
    const queue = await Queue.create(req.body);
    res.status(201).json({
        success: true,
        data: queue,
    });
});

// Helper: Auto-assign ticket
const autoAssignTicket = async (ticket) => {
    // 1. Check rules
    const rules = await AutoAssignRule.find({ isActive: true }).sort("-priority");

    for (const rule of rules) {
        let match = true;
        for (const [key, value] of rule.conditions.entries()) {
            // Simple equality check for now, can be expanded to regex/operators
            if (ticket[key] !== value) {
                match = false;
                break;
            }
        }

        if (match) {
            if (rule.action === 'assign_queue') {
                ticket.queue = rule.targetId;
            } else if (rule.action === 'assign_agent') {
                ticket.assignee = rule.targetId;
            }
            await ticket.save();
            return;
        }
    }

    // 2. Fallback: Round robin or default queue (not implemented for brevity)
};
