const Router = require('express').Router();
const { GetPosts, GetPostById, GetUserPermissionLevel, CreatePost, UpdatePost, DeletePost, AddLikeToPost, AddDislikeToPost, RemoveLikeFromPost, RemoveDislikeFromPost } = require('../controllers/PostController');
const { AuthorizeAndBlock, AuthorizeAndPass } = require('../controllers/AuthController');

Router.route('/posts').get(GetPosts);
Router.route('/post/:Id').get(GetPostById);
Router.route('/post/:Id/permission-level').get(AuthorizeAndBlock, GetUserPermissionLevel);

Router.route('/create/post').post(AuthorizeAndBlock, CreatePost);

Router.route('/update/post/:Id').put(AuthorizeAndBlock, UpdatePost);
Router.route('/add/like/post/:Id').put(AddLikeToPost);
Router.route('/add/dislike/post/:Id').put(AddDislikeToPost);
Router.route('/remove/like/post/:Id').put(RemoveLikeFromPost);
Router.route('/remove/dislike/post/:Id').put(RemoveDislikeFromPost);

Router.route('/delete/post/:Id').delete(AuthorizeAndBlock, DeletePost);

module.exports = Router;