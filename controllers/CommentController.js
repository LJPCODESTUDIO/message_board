const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Mongoose = require('mongoose');

// Utility Methods
function GetCommentResponse(C) {
  return {
        _id: C._id,
        Content: C.Content,
        Likes: C.Likes,
        Dislikes: C.Dislikes,
        Poster: {
          _id: C.Poster._id,
          Username: C.Poster.Username
        },
        IsParentPost: C.IsParentPost,
        Parent: C.Parent,
        CreationDate: C.CreationDate,
        LastEdited: C.LastEdited
    }
}

// GET comments belonging to a post/comments
module.exports.GetComments = async (req, res) => {
    try {
        const Comments = await Comment.find({
            Parent: req.params.Id
        })
        .populate('Poster')
        .populate('Parent')
        .sort({ CreationDate: 'asc' });

        let CleanedComments = [];
        for (let Comment of Comments) {
            CleanedComments = [...CleanedComments, GetCommentResponse(Comment)];
        }

        res.json(CleanedComments);
    }
    catch (Err) {
        console.error(Err);
        res.status(500).json({
            message: Err.message
        });
    }
};

// POST a new comment
module.exports.CreateComment = async (req, res) => {
    try {
        const FoundParent = (req.body.IsParentPost) ? 
        await Post.findById(req.params.Id) : await Comment.findById(req.params.Id);

        if (!FoundParent) {
            return res.status(404).json({
                message: 'Parent does not exist'
            });
        }

        const NewComment = await Comment.create({
            Content: req.body.Content,
            Parent: req.params.Id,
            Poster: res.CurrUser._id,
            IsParentPost: req.body.IsParentPost
        });

        res.status(201).json(NewComment);
    }
    catch (Err) {
        console.error(Err);
        res.status(400).json({
            message: Err.message
        });
    }
};

// DELETE a comment
module.exports.DeleteComment = async (req, res) => {
    try {
        const CommentToDelete = await Comment.findById(
            req.params.Id
        );

        if (!CommentToDelete) {
            return res.status(404).json({
                message: 'Comment does not exist'
            });
        }

        const CheckPermission = res.CurrUser._id.equals(CommentToDelete.Poster) || res.CurrUser.Role === 'admin';
        if (!CheckPermission) {
            return res.status(403).json({
                message: 'You do not have permission to delete this comment.'
            });
        }
        
        await Comment.DeleteComments(CommentToDelete);

        res.json({
            message: 'Comment deleted successfully.'
        });
    }
    catch (Err) {
        console.error(Err);
        res.status(400).json({
            message: Err.message
        });
    }
};

// PUT a comment
module.exports.EditComment = async (req, res) => {
    try {
        const CommentToEdit = await Comment.findById(req.params.Id);
        if (!CommentToEdit) {
            return res.status(404).json({
                message: 'Comment does not exist'
            });
        }

        const CheckPermission = res.CurrUser._id.equals(CommentToEdit.Poster);
        if (!CheckPermission) {
            return res.status(403).json({
                message: 'You do not have permission to edit this comment.'
            });
        }

        await Comment.findByIdAndUpdate(req.params.Id, { Content: req.body.Content, LastEdited: Date.now() });

        res.json({
            message: 'Comment edited successfully.'
        });
    }
    catch (Err) {
        console.error(Err);
        res.status(400).json({
            message: Err.message
        });
    }
};


// Likes/Dislikes
module.exports.AddLikeToComment = async (req, res) => {
  try {
    const Id = req.params.Id;
    const CommentToUpdate = await Comment.findById(Id);

    if (!CommentToUpdate) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }

    await Comment.findByIdAndUpdate(Id, { Likes: CommentToUpdate.Likes + 1 });
    res.json({ message: 'Added like to comment', success: true });
  }
  catch(Err) {
    res.status(400).json({ message: Err.message });
  }
}

module.exports.RemoveLikeFromComment = async (req, res) => {
  try {
    const Id = req.params.Id;
    const CommentToUpdate = await Comment.findById(Id);

    if (!CommentToUpdate) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }
    
    if (CommentToUpdate.Likes < 0) {
      return res.status(400).json({ message: 'Likes cannot go lower than 0', success: false });
    }

    await Comment.findByIdAndUpdate(Id, { Likes: CommentToUpdate.Likes - 1 });
    res.json({ message: 'Removed like from comment', success: true });
  }
  catch(Err) {
    res.status(400).json({ message: Err.message });
  }
}

module.exports.AddDislikeToComment = async (req, res) => {
  try {
    const Id = req.params.Id;
    const CommentToUpdate = await Comment.findById(Id);

    if (!CommentToUpdate) {
      return res.status(404).json({ message: 'Post does not exist' });
    }

    await Comment.findByIdAndUpdate(Id, { Dislikes: CommentToUpdate.Dislikes + 1 });
    res.json({ message: 'added dislike to comment', success: true });
  }
  catch(Err) {
    res.status(400).json({ message: Err.message });
  }
}

module.exports.RemoveDislikeFromComment = async (req, res) => {
  try {
    const Id = req.params.Id;
    const CommentToUpdate = await Comment.findById(Id);

    if (!CommentToUpdate) {
      return res.status(404).json({ message: 'Comment does not exist' });
    }
    
    if (CommentToUpdate.Dislikes < 0) {
      return res.status(400).json({ message: 'Dislikes cannot go lower than 0', success: false });
    }

    await Comment.findByIdAndUpdate(Id, { Dislikes: CommentToUpdate.Dislikes - 1 });
    res.json({ message: 'Removed dislike from post', success: true });
  }
  catch(Err) {
    res.status(400).json({ message: Err.message });
  }
}

// Permission levels for frontend display
// 0 - No permissions
// 1 - Delete post
// 2 - Delete post and edit post
module.exports.GetUserPermissionLevel = async (req, res) => {
  try {
    const Id = req.params.Id;
    const FoundPost = await Comment.findById(Id).populate('Poster');
    if (FoundPost) {
      if (res.CurrUser._id.equals(FoundPost.Poster._id)) {
        return res.json({ Level: 2 });
      }

      if (res.CurrUser.Role === 'admin') {
        return res.json({ Level: 1 })
      }

      return res.json({ Level: 0 });
    }
    else {
      res.status(404).json({ message: 'Comment with that ID does not exist' });
    }
  }
  catch (Err) {
    res.status(500).json({ message: Err.message });
  }
}