const Folder = require('../models/folder');
const User = require('../models/user');
const File = require('../models/file');

exports.createFolder = async (req, res) => {
    const {name, parent} = req.body;
    const owner = await User.findOne({email: req.user.email}).exec();
    
    if(name && parent && owner) {
        const newFolder = await new Folder({
            name,
            _owner: owner._id,
            _parentFolder: parent
        }).save();
        res.status(200).json(newFolder);
    } else if(name && owner && !parent) {
        const newFolder = await new Folder({
            name,
            _owner: owner._id
        }).save();
        res.status(200).json(newFolder);
    } else {
        res.status(400).json('Some parameters are missing');
    }
}

exports.getRootFolders = async (req, res) => {
    try{
        const owner = await User.findOne({email: req.user.email}).exec();
        console.log(owner);
        const folders = 
            await Folder.find({
                _owner: owner._id,
                _parentFolder: null
            }).exec();
        return res.status(200).json({ folders });
    }
    catch(err){
        res.status(401).json({error:true,message:'error retrieving folders'});
    }
}

exports.getFoldersByParent = async (req, res) => {
    try{
        const owner = await User.findOne({email: req.user.email}).exec();
        const folders = 
            await Folder.find({
                _owner: owner._id,
                _parentFolder: req.params.parentId
            }).exec();
        const files = await File.find({
            _owner: owner._id,
            _parentFolder: req.params.parentId
        }).exec();
        res.status(200).json({ folders, files });
    }
    catch(err){
        res.status(401).json({error:true,message:'error retrieving folders'});
    }
}

exports.changeFolderAccess = async (req, res) => {
    try {
        const { access , folderId } = req.body;
        const folders = await Folder.findOneAndUpdate({_id: folderId}, { $set : { access }})
        res.status(200).json(folders);
    } catch(err) {
        res.status(400).json(err);
    }
}

exports.changeFileAccess = async (req, res) => {
    try {
        const { access , fileId } = req.body;
        const files = await File.findOneAndUpdate({_id: fileId}, { $set : { access }})
        res.status(200).json(files);
    } catch(err) {
        res.status(400).json(err);
    }
}

exports.getSharedFolders = async (req, res) => {
    try {
        const avatar = await User.findOne({email: req.user.email}).exec();
        const folders = await Folder.find({_owner: { $in : avatar.friends }, access: 'public'}).exec();
        const files = await File.find({_owner: { $in : avatar.friends }, access: 'public'}).exec();
        res.status(200).json({folders, files});
    } catch(err) {
        res.status(400).json(err);
    }
}