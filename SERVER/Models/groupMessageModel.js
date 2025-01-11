const mongoose = require('mongoose');

const groupMessageSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    text: { type: String },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }]
}, {
    timestamps: true,
});

const groupMessageModel = mongoose.model('groupMessages', groupMessageSchema);
module.exports = groupMessageModel;
