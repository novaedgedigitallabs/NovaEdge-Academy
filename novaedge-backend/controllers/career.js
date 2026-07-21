const Career = require('../models/Career');

// @desc    Get all career positions
// @route   GET /api/v1/careers
// @access  Public
exports.getAllPositions = async (req, res, next) => {
    try {
        const positions = await Career.find({ isActive: true }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: positions.length,
            data: positions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single career position
// @route   GET /api/v1/careers/:id
// @access  Public
exports.getPosition = async (req, res, next) => {
    try {
        const position = await Career.findById(req.params.id);

        if (!position) {
            return res.status(404).json({
                success: false,
                message: `No position found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: position
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create new career position
// @route   POST /api/v1/careers
// @access  Private (Admin)
exports.createPosition = async (req, res, next) => {
    try {
        const position = await Career.create(req.body);

        res.status(201).json({
            success: true,
            data: position
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update career position
// @route   PUT /api/v1/careers/:id
// @access  Private (Admin)
exports.updatePosition = async (req, res, next) => {
    try {
        let position = await Career.findById(req.params.id);

        if (!position) {
            return res.status(404).json({
                success: false,
                message: `No position found with id of ${req.params.id}`
            });
        }

        position = await Career.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: position
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete career position
// @route   DELETE /api/v1/careers/:id
// @access  Private (Admin)
exports.deletePosition = async (req, res, next) => {
    try {
        const position = await Career.findById(req.params.id);

        if (!position) {
            return res.status(404).json({
                success: false,
                message: `No position found with id of ${req.params.id}`
            });
        }

        await position.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};
