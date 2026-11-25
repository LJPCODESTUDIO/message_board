const Router = require('express').Router();

const {
    GetComments,
    CreateComment,
    DeleteComment,
    GetUserPermissionLevel,
    EditComment,
    AddLikeToComment,
    AddDislikeToComment,
    RemoveLikeFromComment,
    RemoveDislikeFromComment
} = require('../controllers/CommentController');

const {
    AuthorizeAndBlock,
    AuthorizeAndPass
} = require('../controllers/AuthController');

Router.get('/comments/:Id', GetComments);
Router.route('/comment/:Id/permission-level').get(AuthorizeAndBlock, GetUserPermissionLevel);

Router.post(
    '/create/comment/:Id',
    AuthorizeAndPass,
    CreateComment
);

Router.route('/edit/comment/:Id').put(AuthorizeAndBlock, EditComment);
Router.route('/add/like/comment/:Id').put(AddLikeToComment);
Router.route('/add/dislike/comment/:Id').put(AddDislikeToComment);
Router.route('/remove/like/comment/:Id').put(RemoveLikeFromComment);
Router.route('/remove/dislike/comment/:Id').put(RemoveDislikeFromComment);

Router.delete(
    '/delete/comment/:Id',
    AuthorizeAndBlock,
    DeleteComment
);

module.exports = Router;