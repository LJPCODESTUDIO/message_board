const Notification = require('../models/Notification');

async function GetNotifications(req, res) {
  try {
    const Notifications = await Notification.find({
      Recipient: res.CurrUser._id
    }).sort({ CreationDate: -1 });
    res.status(200).json(Notifications);
  }
  catch (Err) {
    console.error(Err);
    res.status(500).json({ Message: 'Failed to retrieve notifications' });
  }
}

async function MarkAsRead(req, res) {
  try {
    await Notification.updateMany(
      { Recipient: res.CurrUser._id, IsRead: false },
      { $set: { IsRead: true } }
    );
    res.status(200).json({ Message: 'Notifications marked as read' });
  }
  catch (Err) {
    console.error(Err);
    res.status(500).json({ Message: 'Failed to update notifications' });
  }
}

module.exports = { GetNotifications, MarkAsRead };