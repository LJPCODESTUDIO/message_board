const Comment = require('../models/Comment');
const Post = require('../models/Post');

// GET comments belonging to a post
module.exports.GetComments = async (req, res) => {
    try {
        const Comments = await Comment.find({
            Post: req.params.Id
        })
        .populate('Poster', 'Username')
        .sort({ CreationDate: 'asc' });

        res.json(Comments);
    }
    catch (Err) {
        res.status(500).json({
            message: Err.message
        });
    }
};

// POST a new comment
module.exports.CreateComment = async (req, res) => {
    try {
        if (res.CurrUser.Username === 'anonymous') {
            return res.status(403).json({
                message: 'You must log in to comment'
            });
        }

        const FoundPost = await Post.findById(req.params.Id);

        if (!FoundPost) {
            return res.status(404).json({
                message: 'Post does not exist'
            });
        }

        const NewComment = await Comment.create({
            Content: req.body.Content,
            Post: req.params.Id,
            Poster: res.CurrUser._id
        });

        res.status(201).json(NewComment);
    }
    catch (Err) {
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

        if (!res.CurrUser._id.equals(CommentToDelete.Poster)) {
            return res.status(403).json({
                message: 'Only the original author can delete this comment'
            });
        }

        await Comment.findByIdAndDelete(req.params.Id);

        res.json({
            message: 'Comment deleted successfully'
        });
    }
    catch (Err) {
        res.status(400).json({
            message: Err.message
        });
    }
};