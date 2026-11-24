const Mongoose = require('mongoose');

const NotificationSchema = new Mongoose.Schema({
  Recipient: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Sender: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  Post: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  Message: {
    type: String,
    required: true
  },
  IsRead: {
    type: Boolean,
    default: false
  },
  CreationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Mongoose.model('Notification', NotificationSchema);