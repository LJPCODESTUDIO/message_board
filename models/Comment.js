const Mongoose = require('mongoose');

const Comment = Mongoose.model('Comment', {
    Content: {
        type: String,
        required: true,
        trim: true
    },
    Post: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    Poster: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    CreationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = Comment;