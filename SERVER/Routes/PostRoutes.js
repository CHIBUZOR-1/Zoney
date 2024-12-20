const express = require('express');
const { verifyToken } = require('../Utils/Auth');
const { createPost, getAllPosts, likeUnlikePost, commentOnPost, deletePost } = require('../Controllers/PostController');
const postRouter = express.Router();
const { upload } = require('../Socket/index');

postRouter.post('/create', verifyToken, createPost);
postRouter.get("/all-posts", verifyToken, getAllPosts);
postRouter.post('/like/:id', verifyToken, likeUnlikePost);
postRouter.post("/comment/:id", verifyToken, commentOnPost);
postRouter.delete('/post/:id', verifyToken, deletePost);
postRouter.post('/upload-post-file', upload.single('file'), (req, res) => { 
    if (!req.file) { return res.status(400).send('No file uploaded'); } 
      res.send({ filePath: `${req.file.destination}${req.file.filename}` }); 
  });
  

module.exports = postRouter