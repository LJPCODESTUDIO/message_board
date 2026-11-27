const Mongoose = require('mongoose');
const Assert = require('assert');
const { MongoMemoryServer } = require('mongodb-memory-server');
const App = require('../app');
const User = require('../models/User');

describe('Test the Signup method', () => {
  let MongoServer;

  before(async function() {
    MongoServer = await MongoMemoryServer.create();
    const uri = MongoServer.getUri();
    await Mongoose.connect(uri);
  });

  afterEach(async function() {
    User.deleteMany({});
  });

  after(async function() {
    await Mongoose.disconnect();
    await MongoServer.stop();
  });

  it('Valid data should return 201.', async function() {
    const Data = {
      Email: 'test@email.com',
      Username: 'testguy',
      Password: '123'
    };
    const Response = await Request(App).post('/api/signup').send(Data);

    Assert(Response.statusCode, 201);
  });
});
