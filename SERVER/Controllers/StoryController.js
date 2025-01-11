const notificationModel = require('../Models/NotificationModel');
const storyModel = require('../Models/storyModel');
const userModel = require('../Models/UserModel');

// Add a new story
const createStory = async (req, res, io) => {
  try {
    const { media, type } = req.body;
    if (!media || !type) { 
      console.log('Missing media or type'); 
      return res.status(400).json({ 
        success: false, 
        message: 'Media and type are required' 
      }); 
    }
    const newStory = new storyModel({ 
        user: req.user.userId, 
        media,
        type 
    });
    await newStory.save();
    const user = await userModel.findById(req.user.userId).populate('friends'); 
    const friends = user.friends;
    friends.forEach(friend => {
        const notification = new notificationModel({ 
            from: req.user.userId, 
            to: friend._id, 
            type: 'newStory', 
            read: false, 
            storyId: newStory._id 
        });
        notification.save(); 
        io.to(friend._id.toString()).emit('newNotification', notification);
    });
    const populatedStory = await newStory.populate({ path:'user', select: '-password'});
    io.emit('storyAdded', populatedStory);
    res.status(201).json({ success: true, story: populatedStory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// Fetch all valid stories (not expired)
const getAllStories = async (req, res) => {
  try {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() - 24*60*60*1000); // 24 hours ago
    const stories = await storyModel.find({ createdAt: { $gte: expirationTime } }).populate({
        path: 'user', 
        select: '-password'
      }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, stories });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

// Clean up expired stories
const deleteStories = async (req, res) => {
  try {
    const currentTime = new Date();
    const expirationTime = new Date(currentTime.getTime() - 24*60*60*1000); // 24 hours ago
    await storyModel.deleteMany({ createdAt: { $lt: expirationTime } });
    res.status(200).json({ success: true, message: 'Expired stories removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

module.exports = {createStory, getAllStories, deleteStories};
