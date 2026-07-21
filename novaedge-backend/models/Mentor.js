const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    role: {
        type: String,
        required: [true, 'Please add a role'],
        trim: true,
        maxlength: [50, 'Role can not be more than 50 characters']
    },
    bio: {
        type: String,
        required: [true, 'Please add a bio'],
        maxlength: [500, 'Bio can not be more than 500 characters']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
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

mentorSchema.index({
    name: "text",
    bio: "text",
    skills: "text",
    expertise: "text"
});

module.exports = mongoose.model('Mentor', mentorSchema);
