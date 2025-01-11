const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groupMessages' }],
}, { 
    timestamps: true,
});

const groupModel = mongoose.model('groups', groupSchema);
module.exports = groupModel;
