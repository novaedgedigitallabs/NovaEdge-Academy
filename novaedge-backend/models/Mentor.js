const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    role: {
        type: String,
        required: [true, 'Please add a role'],
        trim: true,
    },
    company: {
        type: String,
        default: 'Top Tech',
    },
    bio: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    },
    skills: [String],
    socialLinks: {
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        github: { type: String, default: "" },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Mentor', mentorSchema);
