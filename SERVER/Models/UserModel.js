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
        type: String
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
        type: String
    }, 
    profileImg: {
        type: String,
        default: 'https://as2.ftcdn.net/v2/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg'
    },
    profileImgPublicId: {
        type: String,
        default: null
    },
    coverImgPublicId: {
        type: String,
        default: null
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
    following:[{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    about: { bio: { type: String }, city: { type: String }, country: { type: String }, worksAt: { type: String }, education: { type: String } },
    age: { type: Number },
    birthdate: { type: Date  },
    role: {
        type: String,
        default: "User"
    },
    password: {
        type: String,
        required: function() { return !this.googleId; }
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    googleId: { type: String, 
        unique: true, 
        sparse: true // Allows for multiple null values 
    }
}, {
    timestamps: true,
    minimize: false
});

/*userSchema.pre('find', function() {
    this.select('-password');
});*/


const userModel = mongoose.model('users', userSchema);

module.exports = userModel;