const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
    requestFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    requestTo: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
  }, {
    timestamps: true
  });
  
  const requestModel = mongoose.model('FriendRequest', FriendRequestSchema);
  module.exports = requestModel;