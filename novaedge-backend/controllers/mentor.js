const Mentor = require('../models/Mentor');

// @desc    Get all mentors
// @route   GET /api/v1/mentors
// @access  Public
exports.getAllMentors = async (req, res, next) => {
    try {
        const mentors = await Mentor.find({ isActive: true }).sort('createdAt');

        res.status(200).json({
            success: true,
            count: mentors.length,
            data: mentors
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Get single mentor
// @route   GET /api/v1/mentors/:id
// @access  Public
exports.getMentor = async (req, res, next) => {
    try {
        const mentor = await Mentor.findById(req.params.id);

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: `No mentor found with id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: mentor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// @desc    Create new mentor
// @route   POST /api/v1/mentors
// @access  Private (Admin)
exports.createMentor = async (req, res, next) => {
    try {
        const mentor = await Mentor.create(req.body);

        res.status(201).json({
            success: true,
            data: mentor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update mentor
// @route   PUT /api/v1/mentors/:id
// @access  Private (Admin)
exports.updateMentor = async (req, res, next) => {
    try {
        let mentor = await Mentor.findById(req.params.id);

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: `No mentor found with id of ${req.params.id}`
            });
        }

        mentor = await Mentor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: mentor
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete mentor
// @route   DELETE /api/v1/mentors/:id
// @access  Private (Admin)
exports.deleteMentor = async (req, res, next) => {
    try {
        const mentor = await Mentor.findById(req.params.id);

        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: `No mentor found with id of ${req.params.id}`
            });
        }

        await mentor.deleteOne();

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
