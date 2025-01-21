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
    res.status(201).json({ success: true, message:'Friend request sent', request: friendRequest });
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
  
    res.status(200).json({ success: true, message:'Friend request accepted'});
  };

  const cancelRequest = async (req, res) => {
    try {
      const { requestId } = req.body;
  
      // Find and delete the pending friend request
      const deletedRequest = await requestModel.findOneAndDelete({
        _id: requestId,
        requestFrom: req.user.userId,
        status: 'pending'
      });
  
      if (!deletedRequest) {
        return res.status(404).json({ success: false, message: 'Friend request not found or already processed' });
      }
  
      res.status(200).json({ success: true, message: 'Friend request canceled successfully' });
    } catch (error) {
      console.error('Error canceling friend request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  
  // Reject Friend Request
  const rejectRequest = async (req, res) => {
    try {
       const { requestId } = req.body;
        const friendRequest = await requestModel.findById(requestId);
        if (!friendRequest || friendRequest.status !== 'pending') { 
          return res.status(400).json({success: false, message: 'Invalid request'}); 
        }
        friendRequest.status = 'rejected';
        await friendRequest.save();
        await requestModel.findByIdAndDelete(requestId);
        res.status(200).json({success: true, message:'Friend request rejected'}); 
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



const getTodaysBirthdays = async (req, res) => {
    try {
      const userId = req.user.userId; 
      const user = await userModel.findById(userId).populate({
        path: 'friends',
        select: 'password'
      }); 
      const today = new Date(); 
      today.setHours(0, 0, 0, 0);

      const friendsWithBirthdayToday = user.friends.filter(friend => { 
        const birthdate = new Date(friend.birthdate); 
        return birthdate.getDate() === today.getDate() && birthdate.getMonth() === today.getMonth(); 
      });
        res.status(200).send({ success: true, friendsWithBirthdayToday });
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

const checkRelationshipStatus = async (userId, profileId) => {
  const isFriend = await userModel.exists({ _id: userId, friends: profileId });
  if (isFriend) return 'friends';

  const sentRequest = await requestModel.findOne({ requestFrom: userId, requestTo: profileId, status: 'pending' });
  if (sentRequest) return 'request_sent';

  const receivedRequest = await requestModel.findOne({ requestFrom: profileId, requestTo: userId, status: 'pending' });
  if (receivedRequest) return 'request_received';

  return 'not_friends';
};
const getRelationshipStatus = async (req, res) => {
  try {
    const { profileId } = req.body;
    const status = await checkRelationshipStatus(req.user.userId, profileId);
    res.status(200).json({ status });
  } catch (error) {
    console.error('Error checking relationship status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const unFriend = async (req, res) => {
  try {
    const { friendId } = req.body;
    // Find the logged-in user and the friend to be unfriended
    const user = await userModel.findById(req.user.userId);
    const friend = await userModel.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove the friend from the user's friend list
    user.friends = user.friends.filter(f => f.toString() !== friendId);
    await user.save();

    // Remove the user from the friend's friend list
    friend.friends = friend.friends.filter(f => f.toString() !== req.user.userId);
    await friend.save();

    res.status(200).json({success: true, message: 'Friend removed successfully' });
  } catch (error) {
    console.error('Error unfriending:', error); 
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





module.exports = { sendRequest, getTodaysBirthdays, unFriend, cancelRequest, acceptRequest, fetchFriendRequests, rejectRequest, getFriendList, fetchAllRequests, getRelationshipStatus };