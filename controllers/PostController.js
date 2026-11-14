const Post = require('../models/Post');

// GET methods
module.exports.GetPostById = async (req, res) => {
  try {
    const Id = req.params.Id;
    const FoundPost = await Post.findById(Id).populate('Poster').exec();
    if (FoundPost) {
      res.json(FoundPost);
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
    const Posts = await Post.find().populate('Poster').exec();
    res.json(Posts);
  }
  catch (Err) {
    res.status(500).json({ message: Err.message });
  }
}

// POST methods
module.exports.CreatePost = async (req, res) => {
  try {
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
    const UpdatedPost = await Post.findByIdAndUpdate(Id, req.body).exec();
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
    const Deleted = await Post.findByIdAndDelete(Id).exec();
    res.json(Deleted);
  }
  catch (Err) {
    res.status(400).json({ message: Err.message });
  }
}