const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const dotenv = require('dotenv');
const multer = require('multer');
const { getDetailsFromToken, verifyToken } = require('../Utils/Auth');
const userModel = require('../Models/UserModel');
const conversationModel = require('../Models/ConversationModel');
const messageModel = require('../Models/MessageModel');
const getDialoguez = require('../Utils/GetDialogue');
const notificationModel = require('../Models/NotificationModel');
const getGroupDialoguez = require('../Utils/GetGroupDialoguez');
const groupModel = require('../Models/GroupModel');
const groupMessageModel = require('../Models/groupMessageModel');

// Socket connection
dotenv.config();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: [process.env.ORIGIN],
        methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
        credentials: true
    }
});

// Multer Configuration
const storage = multer.diskStorage({ 
  destination: (req, file, cb) => { 
    if (file.mimetype.startsWith('image/')) { 
        cb(null, 'uploads/images/'); 
    } else if (file.mimetype.startsWith('video/')) { 
        cb(null, 'uploads/videos/'); 
    } else if (file.mimetype.startsWith('audio/')) { 
        cb(null, 'uploads/others/'); 
    } else { 
        cb(null, 'uploads/voice/'); 
    } 
  }, 
  filename: (req, file, cb) => { 
    //cb(null, `${file.originalname}`); 
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); 
    const extension = file.originalname.split('.').pop(); // Get the file extension 
    const originalExtension = file.mimetype.split('/')[1];
    cb(null, `${file.fieldname}-${uniqueSuffix}.${originalExtension}`);
  } 
}); 

const upload = multer({ storage: storage });

// Endpoint to handle file uploads 
app.post('/upload', upload.single('file'), (req, res) => { 
  if (!req.file) { 
      return res.status(400).send('No file uploaded'); 
  } 
  res.send({ filePath: `${req.file.destination}${req.file.filename}` }); 
});



const onlineUser = new Set();

io.on("connection", async (socket) => {
  try {
    console.log("user", socket.id);
    const token = socket.handshake.auth.token;
    const user = await getDetailsFromToken(token);

    if (!user) {
      socket.disconnect();
      return;
    }

    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());

    io.emit('onlineUser', Array.from(onlineUser));

    socket.on('chats', async (userId) => {
      console.log(userId);
      const userDetails = await userModel.findById(userId);
      const payload = {
        _id: userDetails?._id,
        firstname: userDetails?.firstname,
        lastname: userDetails?.lastname,
        online: onlineUser.has(userId),
        image: userDetails.profileImg,
      };
      socket.emit('message-user', payload);

      // old messages
      const getDialogue = await conversationModel.findOne({
        "$or": [
          { sender: user?._id, receiver: userId },
          { sender: userId, receiver: user?._id },
        ],
      }).populate("message").sort({ updatedAt: -1 });
      socket.emit("message", getDialogue?.message || []);
    });

    // new messages
    socket.on('new message', async (data) => {
      let dialogue = await conversationModel.findOne({
        "$or": [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      });

      if (!dialogue) {
        const newDialogue = await conversationModel({
          sender: data?.sender,
          receiver: data?.receiver,
        });
        dialogue = await newDialogue.save();
      }

      const message = new messageModel({
        text: data?.text,
        image: data?.imageUrl,
        video: data?.videoUrl,
        audio: data?.voiceUrl,
        byUser: data?.sentBy,
      });
      const chat = await message.save();
      await conversationModel.updateOne(
        { _id: dialogue?._id },
        { $push: { message: chat?._id } }
      );

      const getDialogue = await conversationModel.findOne({
        "$or": [
          { sender: data?.sender, receiver: data?.receiver },
          { sender: data?.receiver, receiver: data?.sender },
        ],
      }).populate("message").sort({ updatedAt: -1 });

      io.to(data?.sender).emit("message", getDialogue.message || []);
      io.to(data?.receiver).emit("message", getDialogue.message || []);

      const convoSender = await getDialoguez(data?.sender);
      const convoReceiver = await getDialoguez(data?.receiver);

      io.to(data?.sender).emit("convoUser", convoSender);
      io.to(data?.receiver).emit("convoUser", convoReceiver);
    });
    // Group dialogues
    socket.on("fetchGroupDialogues", async (data) => { 
      const groupDialogues = await getGroupDialoguez(data); 
      socket.emit("groupDialogues", groupDialogues); 
    }); 

    //group details
    socket.on('fetchGroupDetails', async (groupId) => { 
        try { 
          // Fetch group details and old messages in a single query
          const groupDetails = await groupModel.findById(groupId).populate({
            path: "members",
            select: "-password"
          }).populate({
            path: 'messages',
            populate: { path: 'sender', select: '-password' }
          }).sort({updatedAt: -1});
          
          // Emit group details and messages
          socket.emit('groupDetails', groupDetails);
          socket.emit('groupAllMessages', groupDetails.messages || []); 
        } catch (error) { 
          console.error('Error fetching group details:', error);
        } 
    });
    // Create Group 
    socket.on('createGroup', async ({ name, members }) => { 
      const group = new groupModel({ name, members }); 
      await group.save(); 
      members.forEach(member => { 
        io.to(member).emit('groupCreated', {group, uId: member}); 
      })
    });
    // Add Member to Group 
    socket.on('addGroupMember', async ({ groupId, memberId }) => { 
      const group = await groupModel.findById(groupId); 
      if (group) { 
        group.members.push(memberId); 
        await group.save(); 
        io.to(memberId).emit('addedToGroup', group); 
        group.members.forEach(member => { io.to(member).emit('groupUpdated', group); }); 
      } 
    });

    //Remove Member from Group 
    socket.on('removeGroupMember', async ({ groupId, memberId }) => { 
      const group = await groupModel.findById(groupId); 
      if (group) { 
        group.members = group.members.filter(m => m.toString() !== memberId); 
        await group.save(); 
        io.to(memberId).emit('removedFromGroup', group); 
        group.members.forEach(member => { io.to(member).emit('groupUpdated', group); }); 
      } 
    });

    // Group Chat Messages 
    socket.on('groupMessage', async ({ groupId, sender, text, imageUrl, videoUrl, voiceUrl  }) => {
      //const grpConv = await groupModel.findOne({_id: groupId}) 
      const groupMessage = new groupMessageModel({ 
        group: groupId, 
        sender, 
        text,
        image: imageUrl,
        video: videoUrl,
        audio: voiceUrl  
      }); 
      
      await groupMessage.save();

      const group = await groupModel.findByIdAndUpdate(groupId,{
        $push: { messages: groupMessage._id }},
        { new: true }).populate({ path: 'members', select: '-password' }).populate({
          path: 'messages',
          populate: { path: 'sender', select: '-password' } // Populate message sender details
        }).sort({updatedAt: -1});

      group.members.forEach(member => { 
        io.to(member?._id.toString()).emit('groupAllMessages', group.messages || []); 
      }); 

      for (const member of group.members) { 
        const groupDialogues = await getGroupDialoguez(member._id.toString()); 
        io.to(member._id.toString()).emit('groupDialogues', groupDialogues); 
      }
    });

    //Mark message as seen for specific member
    socket.on('markGroupMessageAsSeen', async ({ groupId, userId }) => { 
      try { 
        const groupMessages = await groupMessageModel.find({ group: groupId }); 
        groupMessages.forEach(async (message) => { 
          if (!message.seenBy.includes(userId.toString())) { 
            message.seenBy.push(userId); 
            await message.save(); 
          } 
        }); 
        // Fetch updated group dialogues for the user 
        const groupDialogues = await getGroupDialoguez(userId); 
        socket.emit('groupDialogues', groupDialogues); 
      } catch (error) { 
        console.error('Error marking group messages as seen:', error); 
      } 
    });
    socket.on('updateGroupInfo', async(data) => { 
      try { 
        const group = await groupModel.findById(data?.groupId).populate({
          path: 'members',
          select: '-password'
        }); 
        if (group) { 
          group.image = data?.imageUrl; 
          group.name = data?.name;
          await group.save(); 
          // Emit group details to update clients 
          io.emit('groupDetails', group); 
          for (const member of group.members) { 
            const groupDialogues = await getGroupDialoguez(member._id.toString()); 
            io.to(member._id.toString()).emit('groupDialogues', groupDialogues); 
          }
        } else { 
          console.log('Group not found'); 
        } 
      } catch (error) { 
        console.error('Error updating group image:', error); 
      } 
    });

    // Liked Post
    socket.on('postLiked', async ({ from, to, liked }) => {
      if (liked) {  // Only emit if the post is liked
        const notification = new notificationModel({
          from,
          to,
          type: 'liked',
        });
        await notification.save();

        io.to(to).emit('newNotification', notification);
      }
    });

    // Comment on post
    socket.on('commentz', async ({ from, to }) => {
      const notification = new notificationModel({
        from,
        to,
        type: 'comment',
        read: false,
      });
      await notification.save();

      io.to(to).emit('newNotification', notification);
    });

    // sidebar
    socket.on("sidebar", async (data) => {
      const dialogues = await getDialoguez(data);
      socket.emit("convoUser", dialogues);
    });

    socket.on("seen", async (data) => {
      let conversation = await conversationModel.findOne({
        "$or": [
          { sender: user?._id, receiver: data },
          { sender: data, receiver: user?._id },
        ],
      });

      const conversationMsgId = conversation?.message || [];
      await messageModel.updateMany(
        { _id: { "$in": conversationMsgId }, byUser: data },
        { "$set": { seen: true } }
      );
      const convoSender = await getDialoguez(user?._id?.toString());
      const convoReceiver = await getDialoguez(data);

      io.to(user?._id?.toString()).emit("convoUser", convoSender);
      io.to(data).emit("convoUser", convoReceiver);
    });

    socket.on("disconnect", () => {
      onlineUser.delete(user?._id?.toString());
      console.log('User Disconnected');
      io.emit('onlineUser', Array.from(onlineUser));
    });
  } catch (error) {
    console.error('Error in connection:', error);
    socket.disconnect();
  }
});

/*io.on("connection", async(socket)=> {
    console.log("user", socket.id);
    const token = socket.handshake.auth.token;
    const user = await getDetailsFromToken(token)
    
    socket.join(user?._id?.toString());
    onlineUser.add(user?._id?.toString());

    io.emit('onlineUser', Array.from(onlineUser));

    socket.on('chats', async(userId)=> {
      console.log(userId)
      const userDetails = await userModel.findById(userId) 
      const payload = {
        _id: userDetails?._id,
        firstname: userDetails?.firstname,
        lastname: userDetails?.lastname,
        online: onlineUser.has(userId),
        image: userDetails.profileImg
      }
      socket.emit('message-user', payload)
      //old messages
      const getDialogue = await conversationModel.findOne({
        "$or": [
          {sender: user?._id, receiver: userId},
          {sender: userId, receiver: user?._id}
        ]
      }).populate("message").sort({updatedAt: -1})
      socket.emit("message", getDialogue?.message || [])

    })

    // new messages
    socket.on('new message', async(data)=> {
      console.log(data)
      let dialogue = await conversationModel.findOne({
        "$or": [
          {sender: data?.sender, receiver: data?.receiver},
          {sender: data?.receiver, receiver: data?.sender}
        ]
      })
      console.log(dialogue)
      if(!dialogue) {
        const newDialogue = await conversationModel({
          sender: data?.sender,
          receiver: data?.receiver
        })
        dialogue = await newDialogue.save();
      }
      const message = new messageModel({
        text: data?.text,
        image: data?.imageUrl,
        video: data?.videoUrl,
        audio: data?.voiceUrl,
        byUser: data?.sentBy
      })
      const chat = await message.save();
      const updateDialogue = await conversationModel.updateOne({_id: dialogue?._id}, {
        $push: {message: chat?._id}
      })

      const getDialogue = await conversationModel.findOne({
        "$or": [
          {sender: data?.sender, receiver: data?.receiver},
          {sender: data?.receiver, receiver: data?.sender}
        ]
      }).populate("message").sort({updatedAt: -1})

      io.to(data?.sender).emit("message", getDialogue.message || [])
      io.to(data?.receiver).emit("message", getDialogue.message || [])

      const convoSender = await getDialoguez(data?.sender)
      const convoReceiver = await getDialoguez(data?.receiver)

      io.to(data?.sender).emit("convoUser", convoSender)
      io.to(data?.receiver).emit("convoUser", convoReceiver)
    })
    //Liked Post
    socket.on('postLiked', async ({ from, to, liked }) => {
      if (liked) {  // Only emit if the post is liked
          const notification = new notificationModel({
              from,
              to,
              type: 'liked'
          });
          await notification.save();
          
          io.to(to).emit('newNotification', notification);
      }
    });

    // Comment on post
    socket.on('commentz', async({from, to})=> {
      const notification = new notificationModel({
        from,
        to,
        type: 'comment',
        read: false
      });
      await notification.save();
          
      io.to(to).emit('newNotification', notification);
    })
  

    //sidebar
    socket.on("sidebar", async(data)=> {
      const dialogues = await getDialoguez(data);
      socket.emit("convoUser", dialogues)
    })

    socket.on("seen", async(data)=> {
      let conversation = await conversationModel.findOne({
        "$or": [
          {sender: user?._id, receiver: data},
          {sender: data, receiver: user?._id}
        ]
      })
      console.log("c", conversation)

      const conversationMsgId = conversation?.message || [];
      const updateMsgs = await messageModel.updateMany(
        { _id: {"$in" : conversationMsgId}, byUser : data}, 
        {"$set" : {seen: true}}
      )
      const convoSender = await getDialoguez(user?._id?.toString())
      const convoReceiver = await getDialoguez(data)

      io.to(user?._id?.toString()).emit("convoUser", convoSender)
      io.to(data).emit("convoUser", convoReceiver)
    })

    socket.on("disconnect", ()=> {
        onlineUser.delete(user?._id?.toString());
        console.log('User Disconnected');
        io.emit('onlineUser', Array.from(onlineUser));
    })
});*/


module.exports = { upload, app, server, io }