const express = require('express');
const userRouter = express.Router();
const { userRegisteration, userLogin, logout, searchUsers, allUsers, getMutualFriends, getSuggestions, getuserDetails, googleAuthSignUp, googleAuthLogin, updateProfilePhoto, getAllFriends, updateAbout, updateCoverImg, updateProfile, forgotPassword, resetPassword, emailVerification } = require('../Controllers/User');
const {verifyToken } = require('../Utils/Auth');
const { upload } = require('../Socket/index');

userRouter.post('/register', userRegisteration);
userRouter.post('/login', userLogin);
userRouter.get('/logout', logout);
userRouter.post('/search', verifyToken, searchUsers);
userRouter.get('/all_users', verifyToken, allUsers);
userRouter.get('/user-details/:id', verifyToken, getuserDetails);
userRouter.get('/mutual-friends', verifyToken, getMutualFriends);
userRouter.get('/suggestions', verifyToken, getSuggestions);
userRouter.post('/googleAuth', googleAuthSignUp);
userRouter.post('/googleAuthLogin', googleAuthLogin);
userRouter.post('/newProfilePhoto', verifyToken, updateProfilePhoto);
userRouter.post('/newCoverImg', verifyToken, updateCoverImg);
userRouter.get('/all-friends', verifyToken, getAllFriends);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password/:token', resetPassword);
userRouter.get('/verify-email/:token', emailVerification)
userRouter.put('/update-about', verifyToken, updateAbout);
userRouter.put('/update-profile', verifyToken, updateProfile);
userRouter.post('/uploadProfilePhoto', upload.single('file'), (req, res) => { 
    if (!req.file) { return res.status(400).send('No file uploaded'); } 
      res.send({ filePath: `${req.file.destination}${req.file.filename}` }); 
});

module.exports = userRouter;