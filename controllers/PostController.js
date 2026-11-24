const Mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Utility Methods
function GetPostResponse(P) {
  return {
        _id: P._id,
        Title: P.Title,
        Content: P.Content,
        Likes: P.Likes,
        Dislikes: P.Dislikes,
        Poster: {
          _id: P.Poster._id,
          Username: P.Poster.Username
        },
        CreationDate: P.CreationDate,
        LastEdited: P.LastEdited
      }
}

// GET methods
module.exports.GetPostById = async (req, res) => {
  try {
    const Id = req.params.Id;
    const FoundPost = await Post.findById(Id).populate('Poster');
    if (FoundPost) {
      const ForClient = GetPostResponse(FoundPost);
      res.json(ForClient);
    }
    else {
      res.status(404).json({ message: 'Post with that ID does not exist' });
    }
  }
  catch (Err) {
    res.status(500).json({ message: Err.message });
  }
}

module.exports.GetPosts = async (req, res) => {
  try {
    const Posts = await Post.find().sort({ CreationDate: 'desc' }).populate('Poster');
    const PostsForClient = Posts.map(P => { return GetPostResponse(P); });

    res.json(PostsForClient);
  }
  catch (Err) {
    console.error(Err);
    res.status(500).json({ message: Err.message });
  }
}

// Permission levels for frontend display
// 0 - No permissions
// 1 - Delete post
// 2 - Delete post and edit post
module.exports.GetUserPermissionLevel = async (req, res) => {
  try {
    const Id = req.params.Id;
    const FoundPost = await Post.findById(Id).populate('Poster');
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
      res.status(404).json({ message: 'Post with that ID does not exist' });
    }
  }
  catch (Err) {
    res.status(500).json({ message: Err.message });
  }
}

// POST methods
module.exports.CreatePost = async (req, res) => {
  try {
    if (res.CurrUser.Username === 'anonymous') {
      return res.status(401).json({ message: 'Only users that are logged in are allowed to create posts' });
    }

    const PostData = {
      Title: req.body.Title,
      Content: req.body.Content,
      Poster: res.CurrUser._id
    }
    const NewPost = await Post.create(PostData);
    res.status(201).json(NewPost);
  }
  catch (Err) {
    res.status(400).json({ message: Err.message });
  }
}

// PUT methods
module.exports.UpdatePost = async (req, res) => {
  try {
    const Id = req.params.Id;
    const PostToUpdate = await Post.findById(Id).populate('Poster');
    if (!res.CurrUser._id.equals(PostToUpdate.Poster._id)) {
      return res.status(401).json({ message: 'Only the original poster can edit a post' });
    }
    
    const NewData = {
      Title: req.body.Title,
      Content: req.body.Content,
      LastEdited: Date.now()
    }
    const UpdatedPost = await Post.findByIdAndUpdate(Id, NewData, { returnDocument: 'after' });
    res.json(UpdatedPost);
  }
  catch(Err) {
    res.status(400).json({ message: Err.message });
  }
}

// DELETE methods
module.exports.DeletePost = async (req, res) => {
    try {
        const Id = req.params.Id;
        const PostToDelete = await Post.findById(Id);
      
        if (!PostToDelete) {
            return res.status(404).json({
                message: 'Post does not exist'
            });
        }
      
        const HasPermission = res.CurrUser._id.equals(PostToDelete.Poster) || res.CurrUser.Role === 'admin';
        if (!HasPermission) {
          return res.status(401).json({ message: 'You do not have permission to delete this post.' });
        }

        await Comment.deleteMany({ Post: Id });

        await Post.findByIdAndDelete(Id);

        res.json({
            message: 'Post deleted successfully'
        });
    }
    catch (Err) {
        res.status(400).json({
            message: Err.message
        });
    }
};