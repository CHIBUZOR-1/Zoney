// cronJobs.js
const cron = require('node-cron');
const userModel = require('../Models/UserModel');
const { deleteStories } = require('../Controllers/StoryController');


cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
        const users = await userModel.find().populate('friends');
        
        for (const user of users) { 
            const friendsWithBirthdayToday = user.friends.filter(friend => { 
                const birthdate = new Date(friend.birthdate); 
                return birthdate.getDate() === today.getDate() && birthdate.getMonth() === today.getMonth(); 
            });

            for (const friend of friendsWithBirthdayToday) { 
                friend.age += 1; await friend.save(); 
                console.log(`Updated age for ${friend.username} to ${friend.age}`);
            }
        }

        console.log('Updated friends\' birthdays for today');
    } catch (error) {
        console.error('Error updating friends\' birthdays:', error);
    }
});

/*cron.schedule('0 0 * * *', async () => {
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
});*/

cron.schedule('0 * * * *', async () => {
    await deleteStories();
});


module.exports = cron;
/*
// cronJobs.js
const cron = require('node-cron');
const userModel = require('../Models/UserModel');
const birthdayModel = require('../Models/BirthdayModel');
const { deleteStories } = require('../Controllers/StoryController');

cron.schedule('0 0 * * *', async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    try {
        const users = await userModel.find().populate('friends');
        await birthdayModel.deleteMany({}); // Clear the collection
        
        for (const user of users) {
            const friendsWithBirthdayToday = user.friends.filter(friend => {
                const birthdate = new Date(friend.birthdate);
                return birthdate.getDate() === today.getDate() && birthdate.getMonth() === today.getMonth();
            });

            if (friendsWithBirthdayToday.length > 0) {
                await birthdayModel.insertMany(friendsWithBirthdayToday.map(friend => ({
                    userId: user._id,
                    friendId: friend._id,
                    username: friend.username,
                    age: friend.age + 1,
                })));
            }
        }

        console.log('Updated friends\' birthdays for today');
    } catch (error) {
        console.error('Error updating friends\' birthdays:', error);
    }
});

cron.schedule('0 * * * *', async () => {
    await deleteStories();
});

module.exports = cron;

*/