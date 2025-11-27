const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter blog title'],
        trim: true,
        maxLength: [100, 'Blog title cannot exceed 100 characters']
    },
    excerpt: {
        type: String,
        required: [true, 'Please enter blog excerpt'],
        maxLength: [200, 'Excerpt cannot exceed 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Please enter blog content']
    },
    author: {
        type: String,
        required: [true, 'Please enter author name'],
        default: 'NovaEdge Team'
    },
    category: {
        type: String,
        required: [true, 'Please enter category'],
        enum: ['Technology', 'Education', 'Career', 'Design', 'Development', 'News'],
        default: 'Technology'
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2074&auto=format&fit=crop'
    },
    readTime: {
        type: String,
        default: '5 min read'
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

module.exports = mongoose.model('Blog', blogSchema);
