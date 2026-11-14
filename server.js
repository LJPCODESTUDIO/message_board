const Express = require('express');
const Mongoose = require('mongoose');
const Cors = require('cors');
const Path = require('path');
const CookieParser = require("cookie-parser");
const AuthRoute = require("./routes/AuthRoute");
const PostRoute = require('./routes/PostRoute');
require("dotenv").config();

// Variables
const Port = process.env.PORT || 4000;
const DbConnection = process.env.DB_CONNECTION || 'mongodb://localhost:27017/MessageBoardDb';

// Express configuration
const App = Express();

// Middleware
App.use(Cors());
App.use(Express.json());
App.use(Express.static(Path.join(__dirname, 'frontend', 'dist')));
App.use(CookieParser());
App.use('/api', AuthRoute);
App.use('/api', PostRoute);

async function Start() {
  try {
    await Mongoose.connect(DbConnection);
    console.log(`Connected to Database on: ${DbConnection}`);
    App.listen(Port, () => console.log(`Server started on port: ${Port}`));
  }
  catch (Err) {
    console.error(`Database connection failed with message: ${Err.message}`);
  }
}

Start();