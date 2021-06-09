const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/auth');
const { uploadFile } = require('../controllers/fileController');

router.post('/uploadFile', authCheck, uploadFile);

module.exports = router;