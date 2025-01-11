const notificationModel = require('../Models/NotificationModel');

// Get notifications for the current user
const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationModel.find({ to: req.user.userId }).sort({ createdAt: -1}).populate({
      path: "from",
      select: '-password'
    });
    const unreadCount = notifications.filter(notification => !notification.read).length;
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: true, message: "Error fetching notifications" });
  }
};



// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    await notificationModel.updateMany({ to: req.user.userId, read: false }, { read: true });
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ error: true, message: "Error marking notifications as read" });
  }
};

module.exports = { getNotifications, markAllAsRead };
