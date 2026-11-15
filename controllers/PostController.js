const Mongoose = require('mongoose');
const Post = require('../models/Post');

// GET methods
module.exports.GetPostById = async (req, res) => {
  try {
    const Id = req.params.Id;
    const FoundPost = await Post.findById(Id).populate('Poster');
    if (FoundPost) {
      const ForClient = {
        Title: FoundPost.Title,
        Content: FoundPost.Content,
        Likes: FoundPost.Likes,
        Dislikes: FoundPost.Dislikes,
        Poster: {
          _id: FoundPost.Poster._id,
          Username: FoundPost.Poster.Username
        }
      }
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
    const Posts = await Post.find().populate('Poster');
    res.json(Posts);
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
    const NewPost = await Post.create(req.body);
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
    const PostToUpdate = await Post.findById(Id);
    if (PostToUpdate.Poster._id !== res.CurrUser._id) {
      return res.status(401).json({ message: 'Only the original poster can edit a post' });
    }
    const UpdatedPost = await Post.findOneAndUpdate(PostToUpdate, req.body, { returnDocument: 'after' });
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
    if (PostToDelete.Poster._id !== res.CurrUser._id) {
      return res.status(401).json({ message: 'Only the original poster can edit a post' });
    }
    const Deleted = await Post.findOneAndDelete(PostToDelete);
    res.json(Deleted);
  }
  catch (Err) {
    res.status(400).json({ message: Err.message });
  }
}