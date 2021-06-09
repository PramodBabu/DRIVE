const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        requried: true,
        index: true,
    },
    phone_number: {
        type: String,
        index: true,
    },
    friends: [{
        type: ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

module.exports = mongoose.model('User', UserSchema);