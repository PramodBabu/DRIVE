const express = require('express');
const router = express.Router();

const { authCheck } = require('../middlewares/auth');
const { getRootFolders, createFolder, getFoldersByParent, changeFolderAccess, changeFileAccess, getSharedFolders} = require('../controllers/folderController');

router.post('/folder', authCheck, createFolder);
router.get('/folders', authCheck, getRootFolders);
router.get('/folders/:parentId', authCheck, getFoldersByParent);
router.post('/changeFolderAccess', authCheck, changeFolderAccess);
router.post('/changeFileAccess', authCheck, changeFileAccess);
router.get('/shared', authCheck, getSharedFolders);

module.exports = router;