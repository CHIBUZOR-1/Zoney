const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, default: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg'},
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'groupMessages' }],
}, { 
    timestamps: true,
});

const groupModel = mongoose.model('groups', groupSchema);
module.exports = groupModel;


