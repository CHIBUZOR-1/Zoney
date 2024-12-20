const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    message: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "messages"
        }
    ]
}, {
    timestamps: true
})

const conversationModel = mongoose.model('conversations', conversationSchema);

module.exports = conversationModel;