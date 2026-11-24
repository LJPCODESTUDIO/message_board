const Router = require('express').Router();

const {
    GetComments,
    CreateComment,
    DeleteComment,
    GetUserPermissionLevel
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

Router.delete(
    '/delete/comment/:Id',
    AuthorizeAndBlock,
    DeleteComment
);

module.exports = Router;