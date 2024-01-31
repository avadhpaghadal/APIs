const mongoose = require('mongoose');

const multer = require('multer')

const taskschems = mongoose.Schema({
    taskname : {
        type : String 
    },
    tasktype : {
        type : String 
    },
    date : {
        type : String 
    },
    tasks : {
        type : String 
    },
    empids : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'Employee' 
    },
    adminid:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'Admin'
    },
    status:{
        type : String
    }
})



const task = mongoose.model('Task',taskschems);

module.exports = task;  