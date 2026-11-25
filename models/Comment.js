const Mongoose = require('mongoose');

// Comments are very similar to posts. The distinction is made to simplify the logic
const CommentSchema = new Mongoose.Schema({
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

CommentSchema.statics.DeleteComments = async function(Parent) {
    const CommentsToDelete = await this.find({ Parent: Parent._id });
    for (let C of CommentsToDelete) {
      this.DeleteComments(C);
    }
    await this.findByIdAndDelete(Parent._id);
};

module.exports = Mongoose.model('Comment', CommentSchema);