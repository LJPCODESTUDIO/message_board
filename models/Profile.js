const Mongoose = require('mongoose');

// Profiles contain public facing information that is sent to the client. No secrets should be stored here.
const Profile = Mongoose.model('Profile', {
  Name: String,
  Description: String,
  IsAnonymous: Boolean // This flag is needed since anonymous profiles will still need to be stored. However we could probably just point them all to the same profile.
});

module.exports = Profile;