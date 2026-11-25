const Router = require('express').Router();

const {
    GetComments,
    CreateComment,
    DeleteComment,
    GetUserPermissionLevel,
    EditComment
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

Router.delete(
    '/delete/comment/:Id',
    AuthorizeAndBlock,
    DeleteComment
);

module.exports = Router;