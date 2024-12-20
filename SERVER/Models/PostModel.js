const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    text: {
        type: String,
    },
    image: {
        type: String,
    },
    video: {
        type: String,
    },
    likes:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    ],
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users',
                required: true
            }
        }
    ]
}, {
    timestamps: true
});

const postModel = mongoose.model('posts', postSchema);

module.exports = postModel;