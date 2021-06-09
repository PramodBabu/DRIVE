const Folder = require('../models/folder');
const User = require('../models/user');
const File = require('../models/file');
const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
    destination: "./public/",
    filename: function(req, file, cb){
        console.log('requestFile ----- ', file);
       cb(null,file.fieldname + path.extname(file.originalname));
    }
 });

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
}).any();

exports.uploadFile = async (req, res) => {
    const owner = await User.findOne({email: req.user.email}).exec();
    upload(req, res, () => {
        console.log("Request file ---", req.files[0]);//Here you get file.
        const file = new File();
        file.meta_data = req.files[0];
        file.name = req.body.name;
        file._parentFolder = req.body.parent;
        file._owner = owner._id;
        file.save().then( (result) => {
            console.log(result);
            res.send({message:"uploaded successfully", data: file});
        })
        /*Now do where ever you want to do*/
    });
}