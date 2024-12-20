const conversationModel = require("../Models/ConversationModel")

const getDialoguez = async(data) => {
    if(data) {
        const userConvo = await conversationModel.find({
            "$or": [
              {sender: data},
              {receiver: data}
            ]
          }).sort({ updatedAt : -1}).populate("message").populate("sender").populate("receiver")
          
          const dialoguez = userConvo.map((conv)=> {
            const countUnseenConvo = conv.message.reduce((prev, curr)=> {
                if(curr?.byUser.toString() !== data) {
                    return prev + (curr.seen ? 0: 1)
                } else {
                    return prev
                }
                
            }, 0)
            
            return{
              _id: conv?._id,
              sender: conv?.sender,
              receiver: conv?.receiver,
              unseenMsg: countUnseenConvo,
              lastMsg: conv.message[conv?.message?.length - 1]
    
            }
          })

          return dialoguez
          
          //socket.emit("convoUser", dialoguez)
    } else {
        return []
    }
}

module.exports = getDialoguez;