const Router = require('express').Router();
const { GetNotifications, MarkAsRead } = require('../controllers/NotificationController');
const { AuthorizeAndBlock } = require('../controllers/AuthController');

Router.get('/notifications', AuthorizeAndBlock, GetNotifications);
Router.put('/notifications/read', AuthorizeAndBlock, MarkAsRead);

module.exports = Router;