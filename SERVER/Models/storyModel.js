const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  media: { type: String} ,// URL to the media (image/video)
  type: { type: String, enum: ['image', 'video'], required: true },
  storyPublicId: {
    type: String,
},
  createdAt: { type: Date, default: Date.now }
});

const storyModel = mongoose.model('Storys', storySchema);

module.exports = storyModel;
