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