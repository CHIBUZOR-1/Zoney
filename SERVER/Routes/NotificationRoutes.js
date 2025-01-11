const express = require('express');
const { verifyToken } = require('../Utils/Auth');
const { getNotifications, markAllAsRead } = require('../Controllers/NotificationController');
const notificationRouter = express.Router();

notificationRouter.get('/all-notifications', verifyToken, getNotifications);
notificationRouter.post('/markAllAsRead', verifyToken, markAllAsRead);

module.exports = notificationRouter;