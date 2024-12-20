const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    coverImg: {
        type: String,
    },
    gender: {
        type: String,
        required: true
    }, 
    profileImg: {
        type: String,
        default: ""
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    following:[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    bio: {
        type: String,
    },
    age: { type: Number, required: true },
    birthdate: { type: Date, required: true },
    role: {
        type: String,
        default: "User"
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    }
}, {
    timestamps: true
});

/*userSchema.pre('find', function() {
    this.select('-password');
});*/


const userModel = mongoose.model('users', userSchema);

module.exports = userModel;