const express = require('express');
const userRouter = express.Router();
const { userRegisteration, userLogin, logout, searchUsers } = require('../Controllers/User');
const {verifyToken } = require('../Utils/Auth');

userRouter.post('/register', userRegisteration);
userRouter.post('/login', userLogin);
userRouter.get('/logout', logout);
userRouter.post('/search', verifyToken, searchUsers);

module.exports = userRouter;