const express = require('express');
const { verifyToken } = require('../Utils/Auth');
const { createPost, getAllPosts, likeUnlikePost, commentOnPost, deletePost, postByUserId, getPostById } = require('../Controllers/PostController');
const { upload } = require('../Socket/index');
const cloudinary = require('cloudinary').v2;

const createPostRouter = (io) => {
  const postRouter = express.Router();
  postRouter.post('/create', verifyToken, (req, res) => createPost(req, res, io));
  postRouter.get("/all-posts", verifyToken, getAllPosts);
  postRouter.post('/like/:id', verifyToken, likeUnlikePost);
  postRouter.post("/comment/:id", verifyToken, commentOnPost);
  postRouter.delete('/delete-post/:id', verifyToken, deletePost);
  postRouter.get('/view-post/:id', verifyToken, getPostById);
  postRouter.get('/my-posts/:id', verifyToken, postByUserId);
  postRouter.post('/upload-post-file', verifyToken, upload.single('file'), async (req, res) => { 
    if (!req.file) { 
      return res.status(400).send('No file uploaded'); 
    } 
  
    try {
      const fileBuffer = req.file.buffer;
      const fileType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
  
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
          resource_type: fileType,
          upload_preset: 'Zoneyz',
        }, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }).end(fileBuffer);
      }); 
  
      res.send({ filePath: result.secure_url });
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      res.status(500).send('Upload to Cloudinary failed');
    }
  });
  return postRouter;

} 

  

module.exports = createPostRouter;