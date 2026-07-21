const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter job title'],
        trim: true,
        maxLength: [100, 'Job title cannot exceed 100 characters']
    },
    department: {
        type: String,
        required: [true, 'Please enter department'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please enter location'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Please enter job type'],
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
        default: 'Full-time'
    },
    description: {
        type: String,
        required: [true, 'Please enter job description']
    },
    requirements: {
        type: [String],
        default: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Career', careerSchema);
