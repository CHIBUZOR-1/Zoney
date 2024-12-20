const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    text: {
        type: String
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    audio: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    },
    byUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    }
},
{
    timestamps: true
})

const messageModel = mongoose.model('messages', messageSchema);

module.exports = messageModel;