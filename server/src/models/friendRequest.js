const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const FriendRequestSchema = new mongoose.Schema({
    from: {
        type: ObjectId,
        ref: 'User'
    },
    to: {
        type: ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ["accepted", "rejected", "pending"],
        default: "pending"
    }
}, {timestamps: true});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema)