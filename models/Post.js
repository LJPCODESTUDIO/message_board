const Mongoose = require('mongoose');

// Posts are very simple. They contain a title, body, and the like and dislike counts
const Post = Mongoose.model('Post', {
  Title: { type: String, required: true },
  Content: { type: String, default: '' },
  Likes: { type: Number, default: 0 },
  Dislikes: { type: Number, default: 0 },
  Poster: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  CreationDate: { type: Date, default: Date.now() },
  LastEdited: { type: Date, default: Date.now() }
});

module.exports = Post;