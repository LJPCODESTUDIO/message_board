const Mongoose = require('mongoose');
const Assert = require('assert').strict;
const { MongoMemoryServer } = require('mongodb-memory-server');
const App = require('../../app');
const Supertest = require('supertest');
const User = require('../../models/User');

describe('AuthRoute testing', function() {
  let MongoServer;
  let Request;
  let Cookies;
  
  before(async function() {
    MongoServer = await MongoMemoryServer.create();
    const uri = MongoServer.getUri();
    await Mongoose.connect(uri);
  });

  beforeEach(function() {
    Cookies = Supertest.cookies;
    Request = Supertest.agent(App);
  });

  after(async function() {
    await Mongoose.disconnect();
    await MongoServer.stop();
  });

  describe('/api/signup', function() {
    afterEach(async function() {
      await User.deleteMany({});
    });

    it('Valid data should respond with 201', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };

      await Request.post('/api/signup').send(Data).expect(201);
    });

    it('Duplicate usernames should respond with 403', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };
      
      await Request.post('/api/signup').send(Data).expect(201);

      const Data2 = {
        Email: 'test2@email.com',
        Username: 'testguy',
        Password: '123'
      };

      await Request.post('/api/signup').send(Data2).expect(403);
    });

    it('Duplicate emails should respond with 403', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };
      
      await Request.post('/api/signup').send(Data).expect(201);

      const Data2 = {
        Email: 'test@email.com',
        Username: 'testguy2',
        Password: '123'
      };

      await Request.post('/api/signup').send(Data2).expect(403);
    });

    it('Missing fields should respond with 500', async function() {
      const MissingEmail = {
        Username: 'testguy',
        Password: '123'
      };
      await Request.post('/api/signup').send(MissingEmail).expect(500);

      const MissingUsername = {
        Email: 'test@email.com',
        Password: '123'
      };
      await Request.post('/api/signup').send(MissingUsername).expect(500);

      const MissingPassword = {
        Email: 'test@email.com',
        Username: 'testguy'
      };
      await Request.post('/api/signup').send(MissingPassword).expect(500);
    });

    it('Usernames should be lowercased after signup', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'TestGuy',
        Password: '123'
      };

      await Request.post('/api/signup').send(Data).expect(201);

      const FoundUser = await User.findOne({ Email: 'test@email.com' });

      Assert(FoundUser.Username === 'testguy');
    });

    it('A jwt auth token should be created after signup', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };

      await Request.post('/api/signup').send(Data)
        .expect(201)
        .expect(Cookies.set({ name: 'token' }));
    });

    it('The created users password should be hashed', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };

      await Request.post('/api/signup').send(Data).expect(201);

      const FoundUser = await User.findOne({ Username: 'testguy'});

      Assert(FoundUser.Password !== '123');
    })
  });

  describe('/api/login', function() {
    before(async function() {
      await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'fake@email.com',
        Username: 'anonymous',
        Password: '123',
        Role: 'user',
        IsAnonymous: true
      });
    });

    after(async function() {
      await User.deleteMany({});
    });

    it('Logging in with valid credentials should respond with 200', async function() {
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123' }).expect(200);
    });

    it('A jwt auth token should be created after login', async function() {
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123'})
        .expect(200)
        .expect(Cookies.set({ name: 'token' }));
    });

    it('Missing fields should respond with 400', async function() {
      const MissingEmail = {
        Username: 'testguy',
        Password: '123'
      };
      await Request.post('/api/login').send(MissingEmail).expect(400);

      const MissingPassword = {
        Email: 'test@email.com',
        Username: 'testguy'
      };
      await Request.post('/api/login').send(MissingPassword).expect(400);
    });

    it('Incorrect email should respond with 400', async function() {
      await Request.post('/api/login').send({ Email: 'wrong@email.com', Password: '123' }).expect(400);
    });

    it('Incorrect password should respond with 401', async function() {
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '124' }).expect(401);
    })

    it('Attemping to login to the anonymous users account should respond with 403', async function() {
      await Request.post('/api/login').send({ Email: 'fake@email.com', Password: '123' }).expect(403);
    });
  });

  describe('/api/logout', function() {
    before(async function() {
      await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
    });

    after(async function() {
      await User.deleteMany({});
    })

    it('Should set token to ""', async function() {
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123'}).expect(200);
      
      await Request.post('/api/logout').expect(Cookies.contain({ name: 'token', value: '' }));
    });
  });

  describe('/api/changepassword', function() {
    beforeEach(async function() {
      await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123' });
    });

    afterEach(async function() {
      await User.deleteMany({});
    });

    it('Missing fields should response with 400', async function() {
      await Request.post('/api/changepassword').send({ OldPassword: '123' }).expect(400);
      await Request.post('/api/changepassword').send({ NewPassword: '124' }).expect(400);
    });

    it('Being logged out should respond with 401', async function() {
      await Request.post('/api/logout').expect(200);
      await Request.post('/api/changepassword').send({ OldPassword: '123', NewPassword: '124'}).expect(401);
    });

    it('Not using the correct old password should respond with 400', async function() {
      await Request.post('/api/changepassword').send({ OldPassword: '145', NewPassword: '124' }).expect(400);
    });

    it('Valid data should respond with 200', async function() {
      await Request.post('/api/changepassword').send({ OldPassword: '123', NewPassword: '124'}).expect(200);
    });

    it('Valid data should update the password', async function() {
      await Request.post('/api/changepassword').send({ OldPassword: '123', NewPassword: '124'}).expect(200);
      await Request.post('/api/logout').expect(200);
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123'}).expect(401);
    });
  });

  describe('/api/account', function() {
    beforeEach(async function() {
      await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123' });
    });

    afterEach(async function() {
      await User.deleteMany({});
    });

    it('Being logged in should respond with 200 and accurate data', async function() {
      const Response = await Request.get('/api/account').expect(200);
      const ResUser = Response.body.user
      const FoundUser = await User.findOne({ Email: 'test@email.com' });

      Assert(ResUser._id == FoundUser._id);
      Assert(ResUser.Username === FoundUser.Username);
      Assert(ResUser.Email === FoundUser.Email);
      Assert(ResUser.Role === FoundUser.Role);
      Assert(ResUser.IsAnonymous === FoundUser.IsAnonymous);
    });

    it('Being logged out should respond with 401', async function() {
      await Request.post('/api/logout').expect(200);
      await Request.get('/api/account').expect(401);
    });
  });

  describe('/api/profile/:Id', function() {
    let NewUser;

    before(async function() {
      NewUser = await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
    });

    after(async function() {
      await User.deleteMany({});
    });

    it('Passing a valid ID should respond with 200 and accurate data', async function() {
      const Response = await Request.get(`/api/profile/${NewUser._id}`).expect(200);

      Assert(Response.body._id == NewUser._id);
      Assert(Response.body.Username === NewUser.Username);
      Assert(Response.body.Role === NewUser.Role);
    });

    it('Passing an invalid ObjectId-like ID should respond with 404', async function() {
      const Id = new Mongoose.Types.ObjectId();
      await Request.get(`/api/profile/${Id}`).expect(404);
    });

    it('Passing an invalid ID should respond with 500', async function() {
      await Request.get(`/api/profile/1`).expect(500);
    });
  });

  describe('/api/profile/:Id/permission-leve', function() {
    let AdminUser;
    let NormalUser;

    before(async function() {
      AdminUser = await User.create({
        Email: 'admin@email.com',
        Username: 'admin',
        Password: '123',
        Role: 'admin',
        IsAnonymous: false
      });
      NormalUser = await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'fake@email.com',
        Username: 'anonymous',
        Password: '123',
        Role: 'user',
        IsAnonymous: true
      });
    });

    after(async function() {
      await User.deleteMany({});
    });
    
    it('Passing the ID as an admin should respond with 200 and 1', async function() {
      await Request.post('/api/login').send({ Email: 'admin@email.com', Password: '123'}).expect(200);
      const Response = await Request.get(`/api/profile/${NormalUser._id}/permission-level`).expect(200);

      Assert(Response.body.Level === 1);
    });

    it('Passing the ID as a regular user should respond with 200 and 0', async function() {
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123'}).expect(200);
      const Response = await Request.get(`/api/profile/${NormalUser._id}/permission-level`).expect(200);

      Assert(Response.body.Level === 0);
    });

    it('Passing the ID while logged out should respond with 200 and 0', async function() {
      await Request.post('/api/logout').expect(200);
      const Response = await Request.get(`/api/profile/${NormalUser._id}/permission-level`).expect(200);

      Assert(Response.body.Level === 0);
    });

    it('Passing an invalid ObjectId-like ID should respond with 404', async function() {
      const Id = new Mongoose.Types.ObjectId();
      await Request.get(`/api/profile/${Id}/permission-level`).expect(404);
    });

    it('Passing an invalid ID should respond with 500', async function() {
      await Request.get(`/api/profile/1/permission-level`).expect(500);
    });
  });

  describe('/api/role/admin/:Id', function() {
    let AdminUser;
    let NormalUser;

    beforeEach(async function() {
      AdminUser = await User.create({
        Email: 'admin@email.com',
        Username: 'admin',
        Password: '123',
        Role: 'admin',
        IsAnonymous: false
      });
      NormalUser = await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'fake@email.com',
        Username: 'anonymous',
        Password: '123',
        Role: 'user',
        IsAnonymous: true
      });
    });

    afterEach(async function() {
      await User.deleteMany({});
    });

    it('Passing a valid ID while not logged in should respond with 401', async function() {
      await Request.post(`/api/role/admin/${NormalUser._id}`).expect(401);
    });

    it('Passing a valid ID while logged in as a regular user should respond with 403', async function() {
      await Request.post('/api/login').send({ Email: 'test@email.com', Password: '123' }).expect(200);
      await Request.post(`/api/role/admin/${NormalUser._id}`).expect(403);
    });

    it('Passing a valid ID while logged in as an admin should respond with 200 and update the users role', async function() {
      await Request.post('/api/login').send({ Email: 'admin@email.com', Password: '123' }).expect(200);
      await Request.post(`/api/role/admin/${NormalUser._id}`).expect(200);
      const Response = await Request.get(`/api/profile/${NormalUser._id}`).expect(200);

      Assert(Response.body.Role === 'admin');
    });

    it('Passing an invalid ObjectId-like ID should respond with 404', async function() {
      await Request.post('/api/login').send({ Email: 'admin@email.com', Password: '123' }).expect(200);
      const Id = new Mongoose.Types.ObjectId();
      await Request.post(`/api/role/admin/${Id}`).expect(404);
    });

    it('Passing an invalid ID should respond with 500', async function() {
      await Request.post('/api/login').send({ Email: 'admin@email.com', Password: '123' }).expect(200);
      await Request.post(`/api/role/admin/1`).expect(500);
    });
  });
});