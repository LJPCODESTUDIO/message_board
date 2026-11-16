const Mongoose = require('mongoose');

// Posts are very simple. They contain a title, body, and the like and dislike counts
const Post = Mongoose.model('Post', {
  Title: String,
  Content: String,
  Likes: Number,
  Dislikes: Number,
  Poster: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  CreationDate: { type: Date, default: Date.now() },
  LastEdited: { type: Date, default: Date.now() }
});

module.exports = Post;