const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true 
    },
    type: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const notificationModel = mongoose.model('notifications', notificationSchema);

module.exports = notificationModel;