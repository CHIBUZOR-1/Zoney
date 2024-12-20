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

io.on("connection", async(socket)=> {
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
        _id: userDetails?._Id,
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

      const conversationMsgId = conversation.message || []
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
});


module.exports = { upload, app, server }