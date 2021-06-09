const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');

exports.getPeople = async (req, res) => {
    try {
        const avatar = await User.findOne({ email: req.user.email }).exec();
        console.log('excluse friends of avatar ------' ,avatar);
        const users = await User.find({ email: { $ne: avatar.email} , _id: {$nin: avatar.friends} } , '_id name email').exec();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.sendFriendRequest = async (req, res) => {
    try {
        const avatar = await User.findOne({ email: req.user.email }).exec();
        const friend = await User.findOne({ email: req.body.email }).exec();
        // const tempSentRequest = await FriendRequest.find({from: avatar._id, to: friend._id, status: { $nin: ["pending", "accepted"] } }).exec();
        // const tempReceivedRequest = await FriendRequest.find({to: avatar._id, from: friend._id, status: { $nin: ["pending", "accepted"] }}).exec();
        // if( !tempReceivedRequest && !tempSentRequest ) {
            const request = await new FriendRequest({from: avatar._id, to: friend._id}).save();
            res.status(200).json('friend request sent');
        // } else {
            // res.status(200).json('friend request already present');
        // }
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.acceptFriendRequest = async (req, res) => {
    try {
        const initAvatar = await User.findOne({email: req.user.email }).exec();
        const friend = await User.findOneAndUpdate({email: req.body.email }, { $push : {friends: initAvatar._id }}).exec();
        const avatar = await User.findOneAndUpdate({email: req.user.email }, { $push : {friends: friend._id}} ).exec();
        const request = await FriendRequest.findOneAndUpdate({from: friend._id, to: avatar._id},{ $set : { status: "accepted" }}).exec();
        res.status(200).json('friend request accepted');
    } catch (err) {
        res.status(400).json(err);
    }   
}

exports.rejectFriendRequest = async (req, res) => {
    try {
        const friend = await User.findOne({ email: req.body.email }).exec();
        const avatar = await User.findOne({ email: req.user.email}).exec();
        const request = await FriendRequest.findOneAndUpdate({_id: req.body.requestId , from: friend._id, to: avatar._id},{ $set : { status: "rejected" }}).exec();
        res.status(200).json('friend request rejected');
    } catch (err) {
        res.status(400).json(err);
    }   
}

exports.cancelFriendRequest = async (req, res) => {
    try {
        const avatar = await User.findOne({ email: req.user.email}).exec();
        const friend = await User.findOne({ email: req.body.email }).exec();
        const request = await FriendRequest.findOneAndDelete({from: avatar._id, to: friend._id}).exec();
        res.status(200).json(request);
    } catch (err) {
        res.status(400).json(err);
    }   
}

exports.getAllFriends = async (req, res) => {
    try {
        const avatar = await User.find({ email: req.user.email }, 'friends').populate('friends', '_id name email').exec();
        res.status(200).json(avatar);
    } catch (err) {
        res.status(400).json(err);
    } 
}

exports.getAllFriendsRequests = async (req, res) => {
    try {
        const avatar = await User.findOne({email: req.user.email}).exec();
        const sent = await FriendRequest.find({ from: avatar._id , status: { $nin: ["accepted", "rejected"] } }).populate('to', '_id name email').exec();
        const received = await FriendRequest.find({ to: avatar._id, status: { $nin: ["accepted", "rejected"] } }).populate('from', '_id name email').exec();
        res.status(200).json({sent, received});
    } catch (err) {
        res.status(400).json(err);
    }
}