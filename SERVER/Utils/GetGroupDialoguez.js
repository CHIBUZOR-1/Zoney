const groupModel = require("../Models/GroupModel");

const getGroupDialoguez = async (userId) => {
  try {
    if (!userId) { return []; }

    // Find groups where the user is a member
    const userGroups = await groupModel.find({ members: userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'members',
        select: '-password'
      }) // Populate member details
      .populate({
        path: 'messages',
        populate: { path: 'sender', select: '-password' } // Populate message sender details
      });

    const groupDialogues = userGroups.map((group) => {
      // Count unseen messages for the specific user
      const countUnseenMessages = group.messages.reduce((prev, curr) => {
        if (!curr.seenBy.includes(userId.toString())) {
          return prev + 1;
        } else {
          return prev;
        }
      }, 0);
      const lastMsg = group.messages[group.messages.length - 1] ;
      return {
        _id: group._id,
        name: group.name,
        members: group.members,
        unseenMsg: countUnseenMessages,
        lastMsg
      };
    });
    return groupDialogues;
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = getGroupDialoguez;



