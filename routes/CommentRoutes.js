const Router = require('express').Router();

const {
    GetComments,
    CreateComment,
    DeleteComment
} = require('../controllers/CommentController');

const {
    AuthorizeAndBlock
} = require('../controllers/AuthController');

Router.get('/comments/:Id', GetComments);

Router.post(
    '/create/comment/:Id',
    AuthorizeAndBlock,
    CreateComment
);

Router.delete(
    '/delete/comment/:Id',
    AuthorizeAndBlock,
    DeleteComment
);

module.exports = Router;