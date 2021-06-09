const express = require('express');
const router = express.Router();

// middlewares
const {authCheck} = require('../middlewares/auth');

//controller
const {getPeople, sendFriendRequest, acceptFriendRequest, getAllFriends, getAllFriendsRequests, rejectFriendRequest, cancelFriendRequest} = require('../controllers/friendController');

router.get('/getPeople', authCheck, getPeople);
router.post('/addFriend', authCheck, sendFriendRequest);
router.post('/acceptRequest', authCheck, acceptFriendRequest);
router.post('/rejectRequest', authCheck, rejectFriendRequest);
router.post('/cancelRequest', authCheck, cancelFriendRequest)
router.get('/getFriends', authCheck, getAllFriends);
router.get('/getRequests', authCheck, getAllFriendsRequests);

module.exports = router;