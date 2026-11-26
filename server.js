const Mongoose = require('mongoose');
const User = require('./models/User');
const App = require('./app');

// Variables
const Port = process.env.PORT || 4000;
const DbConnection = process.env.DB_CONNECTION || 'mongodb://localhost:27017/MessageBoardDb';

async function Start() {
  try {
    await Mongoose.connect(DbConnection);
    console.log('Connected to Database');
    // Ensures there is always an anonymous profile
    const AnonymousProfile = await User.findOne({ Username: 'anonymous' });
    if (AnonymousProfile === null) {
      await User.create({ Email: 'fake@email.com', Username: 'anonymous', Password: '123', IsAnonymous: true });
    }
    App.listen(Port, () => console.log(`Server started on port: ${Port}`));
  }
  catch (Err) {
    console.error(`Database connection failed with message: ${Err.message}`);
  }
}

Start();