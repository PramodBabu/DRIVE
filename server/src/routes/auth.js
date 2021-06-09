const express = require('express');
const router = express.Router();

// middlewares
const {authCheck, signInWithPhoneAndPassword} = require('../middlewares/auth');

//controller
const {createOrUpdateUser, currentUser} = require('../controllers/authController');

// routes
router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/signInWithPhoneAndPassword', signInWithPhoneAndPassword);
router.post('/current-user', authCheck, currentUser);

module.exports = router;