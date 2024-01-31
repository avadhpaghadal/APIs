const mongoose = require('mongoose');
const multer = require('multer');

const imagePath = "/uploades/Manager";
const path = require('path');

const ManagerRegisterSchema = mongoose.Schema({
    username: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },    
    image: {
        type : String
    },
    adminids : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Register'
    }
})

const ImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../..", imagePath));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now());
    }
})

ManagerRegisterSchema.statics.uploadImage = multer({ storage: ImageStorage }).single("image");
ManagerRegisterSchema.statics.imagePath = imagePath;

const ManagerData = mongoose.model('Manager', ManagerRegisterSchema);
module.exports = ManagerData;