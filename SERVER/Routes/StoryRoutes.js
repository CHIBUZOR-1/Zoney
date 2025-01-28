const express = require('express');
const { verifyToken } = require('../Utils/Auth');
const { upload } = require('../Socket/index');
const { createStory, getAllStories, deleteStories } = require('../Controllers/StoryController');
const cloudinary = require('cloudinary').v2;

const createStoryRouter = (io) => {
    const storyRouter = express.Router();
    storyRouter.post('/newStory', verifyToken, (req, res) => createStory(req, res, io));
    storyRouter.get('/all-stories', verifyToken, getAllStories);
    storyRouter.delete('delete-stories', verifyToken, deleteStories);
    storyRouter.post('/upload-story-file', upload.single('file'), async(req, res) => { 
        if (!req.file) { return res.status(400).send('No file uploaded'); } 
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
        
            res.send({ filePath: result.secure_url, publicId: result.public_id  });
          } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            res.status(500).send('Upload to Cloudinary failed');
          }
    });
    return storyRouter;
}

module.exports = createStoryRouter;