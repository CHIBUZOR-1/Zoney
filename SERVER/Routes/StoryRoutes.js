const express = require('express');
const { verifyToken } = require('../Utils/Auth');
const { upload } = require('../Socket/index');
const { createStory, getAllStories, deleteStories } = require('../Controllers/StoryController');

const createStoryRouter = (io) => {
    const storyRouter = express.Router();
    storyRouter.post('/newStory', verifyToken, (req, res) => createStory(req, res, io));
    storyRouter.get('/all-stories', verifyToken, getAllStories);
    storyRouter.delete('delete-stories', verifyToken, deleteStories);
    storyRouter.post('/upload-story-file', upload.single('file'), (req, res) => { 
        if (!req.file) { return res.status(400).send('No file uploaded'); } 
          res.send({ filePath: `${req.file.destination}${req.file.filename}` }); 
    });
    return storyRouter;
}

module.exports = createStoryRouter;