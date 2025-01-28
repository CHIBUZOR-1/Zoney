const express = require('express');
const userRouter = express.Router();
const { userRegisteration, userLogin, logout, searchUsers, allUsers, getMutualFriends, getSuggestions, getuserDetails, googleAuthSignUp, googleAuthLogin, updateProfilePhoto, getAllFriends, updateAbout, updateCoverImg, updateProfile, forgotPassword, resetPassword, emailVerification } = require('../Controllers/User');
const {verifyToken } = require('../Utils/Auth');
const { upload } = require('../Socket/index');
const userModel = require('../Models/UserModel');
const cloudinary = require('cloudinary').v2;

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
userRouter.post('/uploadCoverPhoto', verifyToken, upload.single('file'), async(req, res) => { 
  if (!req.file) { return res.status(400).send('No file uploaded'); } 
  try {
    const userId = req.user.userId;
    const user = await userModel.findById(userId);
    if (user.coverImgPublicId) {
      await cloudinary.uploader.destroy(user.coverImgPublicId);
    }
    const fileBuffer = req.file.buffer;
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({
        resource_type: 'image',
        upload_preset: 'Zoneyz',
      }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(fileBuffer);
    }); 

    user.coverImgPublicId = result.public_id; // Store the new public_id
    await user.save();
    res.send({ filePath: result.secure_url });
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    res.status(500).send('Upload to Cloudinary failed');
  }
});
userRouter.post('/uploadProfilePhoto', verifyToken, upload.single('file'), async(req, res) => { 
    if (!req.file) { return res.status(400).send('No file uploaded'); } 
    try {
      const userId = req.user.userId;
      const user = await userModel.findById(userId);
      if (user.profileImgPublicId) {
        await cloudinary.uploader.destroy(user.profileImgPublicId);
      }
      const fileBuffer = req.file.buffer;
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          resource_type: 'image',
          upload_preset: 'Zoneyz',
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(fileBuffer);
      }); 

      user.profileImgPublicId = result.public_id; // Store the new public_id
      await user.save();
      res.send({ filePath: result.secure_url });
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      res.status(500).send('Upload to Cloudinary failed');
    }
});

module.exports = userRouter;