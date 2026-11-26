const Express = require('express');
const Cors = require('cors');
const Path = require('path');
const CookieParser = require("cookie-parser");
const AuthRoute = require("./routes/AuthRoute");
const PostRoute = require('./routes/PostRoute');
const CommentRoutes = require('./routes/CommentRoutes');
const NotificationRoute = require('./routes/NotificationRoute');
require("dotenv").config();

// Express configuration
const App = Express();

// Middleware
// edited it for cookie credentials
App.use(Cors({
  credentials: true,
}));
App.use(Express.json());
App.use(CookieParser());
App.use('/api', AuthRoute);
App.use('/api', PostRoute);
App.use('/api', CommentRoutes);
App.use('/api', NotificationRoute);
App.use(Express.static(Path.join(__dirname, 'frontend', 'dist')));
App.use((req, res) => {
  res.sendFile(Path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

module.exports = App;