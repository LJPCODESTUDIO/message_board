const Router = require('express').Router();
const { GetPosts, GetPostById, GetUserPermissionLevel, CreatePost, UpdatePost, DeletePost } = require('../controllers/PostController');
const { AuthorizeAndBlock, AuthorizeAndPass } = require('../controllers/AuthController');

Router.route('/posts').get(GetPosts);
Router.route('/post/:Id').get(GetPostById);
Router.route('/post/:Id/permission-level').get(AuthorizeAndBlock, GetUserPermissionLevel);

Router.route('/create/post').post(AuthorizeAndBlock, CreatePost);

Router.route('/update/post/:Id').put(AuthorizeAndBlock, UpdatePost);

Router.route('/delete/post/:Id').delete(AuthorizeAndBlock, DeletePost);

module.exports = Router;