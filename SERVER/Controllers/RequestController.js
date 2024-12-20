const requestModel = require('../Models/FriendRequestModel');
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
  
    res.status(200).send('Friend request accepted');
  };
  
  // Reject Friend Request
  const rejectRequest = async (req, res) => {
    try {
       const { requestId } = req.body;
        const friendRequest = await requestModel.findById(requestId);
        friendRequest.status = 'rejected';
        await friendRequest.save();
        res.status(200).send('Friend request rejected'); 
    } catch (error) {
        console.log(error);
    }
    
  }

  const fetchFriendRequests = async (req, res) => { 
    try { 
      /*const user = await userModel.findById(req.user.userId).populate('friendRequests'); 
      if (!user) return res.status(404).send('User not found'); // Find all friend requests for the user*/ 
      const friendRequests = await requestModel.find({ requestTo: req.user.userId, status: 'pending' }).populate('requestFrom'); 
      res.send(friendRequests); 
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

module.exports = { sendRequest, acceptRequest, fetchFriendRequests, rejectRequest };