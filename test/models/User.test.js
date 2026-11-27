const Mongoose = require('mongoose');
const Assert = require('assert').strict;
const bcrypt = require('bcrypt');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

describe('User Model testing', function() {
  let MongoServer;

  before(async function() {
    MongoServer = await MongoMemoryServer.create();
    const uri = MongoServer.getUri();
    await Mongoose.connect(uri);
  });

  after(async function() {
    await Mongoose.disconnect();
    await MongoServer.stop();
  });

  describe('User creation', function() {
    afterEach(async function() {
      await User.deleteMany({});
    });

    it('Valid data should not error', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };
      const NewUser = await User.create(Data);

      Assert(!NewUser.isNew);
    });

    it('Duplicate emails should error', async function() {
      const Data1 = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };

      await User.create(Data1);

      const Data2 = {
        Email: 'test@email.com',
        Username: 'totallynewguy',
        Password: '123'
      };
      
      try {
        await User.create(Data2);
        Assert.fail();
      }
      catch (Err) {
        return;
      }
    });

    it('Duplicate usernames should error', async function() {
      const Data1 = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };

      await User.create(Data1);

      const Data2 = {
        Email: 'test2@email.com',
        Username: 'testguy',
        Password: '123'
      };
      
      try {
        await User.create(Data2);
        Assert.fail();
      }
      catch (Err) {
        return;
      }
    });

    it('Duplicate passwords should not error', async function() {
      const Data1 = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };

      await User.create(Data1);

      const Data2 = {
        Email: 'test2@email.com',
        Username: 'testguy2',
        Password: '123'
      };
      
      await User.create(Data2);
    });

    it('Saving a new user should hash the password', async function() {
      const Data = {
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123'
      };
      
      const NewUser = await User.create(Data);

      if (NewUser.Password === '123') {
        Assert.fail('Password was not hashed');
      }
    });
  });

  describe('Fetching user data', function() {
    before(async function() {
      await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'test2@email.com',
        Username: 'testguy2',
        Password: '1234',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'admin@email.com',
        Username: 'admin',
        Password: '12345',
        Role: 'admin',
        IsAnonymous: false
      });
    });

    after(async function() {
      await User.deleteMany({});
    });

    it('Getting all the users should return a non-empty array', async function() {
      const Users = await User.find();

      Assert.notEqual(Users.length, 0);
    })

    it('Getting user from username should return valid data', async function() {
      const FoundUser = await User.findOne({ Username: 'testguy' });

      if (FoundUser.Email !== 'test@email.com') {
        Assert.fail(`Expected: test@email.com but got: ${FoundUser.Email}`);
      }
    });

    it('Getting a non-existent user should return null', async function() {
      const FoundUser = await User.findOne({ Username: 'idontexist' });
      
      Assert(FoundUser === null);
    });

    it('Hashed passwords should still be able to be verified', async function() {
      const FoundUser = await User.findOne({ Username: 'testguy' });
      const ValidPassword = await bcrypt.compare('123', FoundUser.Password);

      Assert(ValidPassword);
    });
  });

  describe('Modifying users', function() {
    before(async function() {
      await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'test2@email.com',
        Username: 'testguy2',
        Password: '1234',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'admin@email.com',
        Username: 'admin',
        Password: '12345',
        Role: 'admin',
        IsAnonymous: false
      });
    });

    after(async function() {
      await User.deleteMany({});
    });

    it('Updating the name with valid data should update the database', async function() {
      await User.findOneAndUpdate({ Username: 'testguy'}, { Username: 'newtestguy' });

      const FoundUser = await User.findOne({ Email: 'test@email.com' });

      if (FoundUser.Username !== 'newtestguy') {
        Assert.fail(`Expected: newtestguy but got ${FoundUser.Username}`);
      }
    });
  });

  describe('Deleting users', function() {
    before(async function() {
      await User.create({
        Email: 'test@email.com',
        Username: 'testguy',
        Password: '123',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'test2@email.com',
        Username: 'testguy2',
        Password: '1234',
        Role: 'user',
        IsAnonymous: false
      });
      await User.create({
        Email: 'admin@email.com',
        Username: 'admin',
        Password: '12345',
        Role: 'admin',
        IsAnonymous: false
      });
    });

    after(async function() {
      await User.deleteMany({});
    });

    it('Deleting a user should remove it from the database', async function() {
      await User.findOneAndDelete({ Username: 'testguy'});

      const FoundUser = await User.findOne({ Email: 'test@email.com' });

      Assert(FoundUser === null);
    });
  });
});