const Express = require('express');
const Mongoose = require('mongoose');
const Cors = require('cors');
const Path = require('path');

// Variables
const port = process.env.PORT || 4000;

// Express configuration
const App = Express();
App.use(Cors());
App.use(Express.json());
App.use(Express.static(Path.join(__dirname, 'frontend', 'dist')));

App.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});