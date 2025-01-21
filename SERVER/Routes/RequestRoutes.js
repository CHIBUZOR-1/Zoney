const express = require('express');
const { sendRequest, acceptRequest, rejectRequest, fetchFriendRequests, getRelationshipStatus, fetchAllRequests, cancelRequest, unFriend, getTodaysBirthdays } = require('../Controllers/RequestController');
const { verifyToken } = require('../Utils/Auth');
const requestRouter = express.Router();

// Adding authentication middleware to the routes 
requestRouter.post('/send-request', verifyToken, sendRequest); 
requestRouter.post('/accept-request', verifyToken, acceptRequest); 
requestRouter.post('/reject-request', verifyToken, rejectRequest); 
requestRouter.post('/cancel-request', verifyToken, cancelRequest); 
requestRouter.post('/unfriend', verifyToken, unFriend); 
requestRouter.get('/birthdays', verifyToken, getTodaysBirthdays);
requestRouter.get('/friend-requests', verifyToken, fetchFriendRequests);
requestRouter.get('/all-friend-requests', verifyToken, fetchAllRequests);
requestRouter.post('/check-relationship-status', verifyToken, getRelationshipStatus);

module.exports = requestRouter;