const express = require('express');
const { sendRequest, acceptRequest, rejectRequest, fetchFriendRequests } = require('../Controllers/RequestController');
const { verifyToken } = require('../Utils/Auth');
const requestRouter = express.Router();

// Adding authentication middleware to the routes 
requestRouter.post('/send-request', verifyToken, sendRequest); 
requestRouter.post('/accept-request', verifyToken, acceptRequest); 
requestRouter.post('/reject-request', verifyToken, rejectRequest); 
requestRouter.get('/friend-requests', verifyToken, fetchFriendRequests);

module.exports = requestRouter;