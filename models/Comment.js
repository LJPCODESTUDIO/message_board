const Mongoose = require('mongoose');

// Comments are very similar to posts. The distinction is made to simplify the logic
const Comment = Mongoose.model('Comment', {
  Content: { type: String, required: true },
  Likes: { type: Number, default: 0 },
  Dislikes: { type: Number, default: 0 },
  Poster: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  IsParentPost: { type: Boolean, default: true },
  Parent: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: (this.IsParentPost ? 'Post' : 'Comment')
  },
  CreationDate: { type: Date, default: Date.now() },
  LastEdited: { type: Date, default: Date.now() }
});

module.exports = Comment;