const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const FolderSchema = new mongoose.Schema({
    name: String,
    _parentFolder: {
        type: ObjectId,
        default: null,
        ref: 'Folder'
    },
    _owner: {
        type: ObjectId,
        default: null,
        ref: 'User'
    },
    access: {
        type: 'String',
        enum: ['private', 'public'],
        default: 'private'
    }
}, {timestamps: true});

module.exports = mongoose.model('Folder', FolderSchema);