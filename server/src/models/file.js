const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {ObjectId} = mongoose.Schema;

const FileSchema = new Schema({
    meta_data:{},
    _owner: {
        type: ObjectId,
        ref: 'User'
    },
    _parentFolder: {
        type: ObjectId,
        ref: 'Folder'
    },
    name: {
        type: String,
        index: true
    },
    access: {
        type: 'String',
        enum: ['private', 'public'],
        default: 'private'
    }
}, {timestamps: true});

module.exports = mongoose.model('File', FileSchema);

