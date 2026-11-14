const Router = require('express').Router();
const PostController = require('../controllers/PostController');

Router.get('/posts', PostController.GetPosts);
Router.get('/post/:Id', PostController.GetPostById);

Router.post('/create/post', PostController.CreatePost);

Router.put('/update/post/:Id', PostController.UpdatePost);

Router.delete('/delete/post/:Id', PostController.DeletePost);

module.exports = Router;