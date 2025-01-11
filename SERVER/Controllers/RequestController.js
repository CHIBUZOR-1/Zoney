const requestModel = require('../Models/FriendRequestModel');
const notificationModel = require('../Models/NotificationModel');
const userModel = require('../Models/UserModel');

// Send Friend Request
const sendRequest = async (req, res) => {
    const { recipientId } = req.body;
    const friendRequest = new requestModel({
      requestFrom: req.user.userId,
      requestTo: recipientId,
    });
    await friendRequest.save();
    res.status(201).send('Friend request sent');
  }
  
  // Accept Friend Request
  const acceptRequest = async (req, res) => {
    const { requestId } = req.body;
    const friendRequest = await requestModel.findById(requestId);
    friendRequest.status = 'accepted';
    await friendRequest.save();
  
    // Add each user to the other's friend list
    const requester = await userModel.findById(friendRequest.requestFrom);
    const recipient = await userModel.findById(friendRequest.requestTo);
    requester.friends.push(recipient._id);
    recipient.friends.push(requester._id);
    await requester.save();
    await recipient.save();

    await requestModel.findByIdAndDelete(requestId);
  
    res.status(200).send('Friend request accepted');
  };
  
  // Reject Friend Request
  const rejectRequest = async (req, res) => {
    try {
       const { requestId } = req.body;
        const friendRequest = await requestModel.findById(requestId);
        if (!friendRequest || friendRequest.status !== 'pending') { 
          return res.status(400).send('Invalid request'); 
        }
        friendRequest.status = 'rejected';
        await friendRequest.save();
        await requestModel.findByIdAndDelete(requestId);
        res.status(200).send('Friend request rejected'); 
    } catch (error) {
        console.log(error);
    }
    
  }

  const fetchFriendRequests = async (req, res) => { 
    try { 
      /*const user = await userModel.findById(req.user.userId).populate('friendRequests'); 
      if (!user) return res.status(404).send('User not found'); // Find all friend requests for the user*/ 
      const friendRequests = await requestModel.find({ requestTo: req.user.userId, status: 'pending' }).populate({
        path: 'requestFrom',
        select: "-password"
      }); 
      res.status(200).send(friendRequests); 
    } catch (error) { 
      console.error(error); 
      res.status(500).send('Server error'); 
    } 
  };
  const fetchAllRequests = async (req, res) => { 
    try { 
      /*const user = await userModel.findById(req.user.userId).populate('friendRequests'); 
      if (!user) return res.status(404).send('User not found'); // Find all friend requests for the user*/ 
      const friendRequests = await requestModel.find({ status: 'pending' }).sort({ createdAt: -1})
      res.status(200).send(friendRequests); 
    } catch (error) { 
      console.error(error); 
      res.status(500).send('Server error'); 
    } 
  };

  const getBirthDays = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).populate('friends');
        if (!user) return res.status(404).send('User not found');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const friendsWithBirthdayToday = user.friends.filter(friend => {
            const birthdate = new Date(friend.birthdate);
            return birthdate.getDate() === today.getDate() && birthdate.getMonth() === today.getMonth();
        });

        res.status(200).send(friendsWithBirthdayToday);
    } catch (error) {
        res.status(500).send({ success: false, message: 'Server error', error });
    }
};

const getFriendList = async(req, res)=> {
  try {
    const user = await userModel.findById(req.user.userId).populate({
      path: 'friends',
      select: '-password'
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user.friends);
  } catch (error) {
    console.error('Error fetching friends:', error); 
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = { sendRequest, acceptRequest, fetchFriendRequests, rejectRequest, getFriendList, fetchAllRequests };