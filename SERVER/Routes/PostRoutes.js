const express = require('express');
const { verifyToken } = require('../Utils/Auth');
const { createPost, getAllPosts, likeUnlikePost, commentOnPost, deletePost, postByUserId, getPostById } = require('../Controllers/PostController');
const { upload } = require('../Socket/index');

const createPostRouter = (io) => {
  const postRouter = express.Router();
  postRouter.post('/create', verifyToken, (req, res) => createPost(req, res, io));
  postRouter.get("/all-posts", verifyToken, getAllPosts);
  postRouter.post('/like/:id', verifyToken, likeUnlikePost);
  postRouter.post("/comment/:id", verifyToken, commentOnPost);
  postRouter.delete('/delete-post/:id', verifyToken, deletePost);
  postRouter.get('/view-post/:id', verifyToken, getPostById);
  postRouter.get('/my-posts/:id', verifyToken, postByUserId);
  postRouter.post('/upload-post-file', upload.single('file'), (req, res) => { 
      if (!req.file) { return res.status(400).send('No file uploaded'); } 
        res.send({ filePath: `${req.file.destination}${req.file.filename}` }); 
  });
  return postRouter;

} 

  

module.exports = createPostRouter;