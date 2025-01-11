// cronJobs.js
const cron = require('node-cron');
const userModel = require('../Models/UserModel');
const { deleteStories } = require('../Controllers/StoryController');

cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
        const users = await userModel.find();
        users.forEach(async (user) => {
            const birthdate = new Date(user.birthdate);
            if (birthdate.getDate() === today.getDate() && birthdate.getMonth() === today.getMonth()) {
                // It's the user's birthday, increment age
                user.age += 1;
                await user.save();
                console.log(`Updated age for ${user.username} to ${user.age}`);
            }
        });
    } catch (error) {
        console.error('Error updating users age:', error);
    }
});

cron.schedule('0 * * * *', async () => {
    await deleteStories();
});


module.exports = cron;
