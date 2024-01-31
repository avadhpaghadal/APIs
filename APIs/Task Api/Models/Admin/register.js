const mongoose = require('mongoose');

const imagePath = "/Uploades/Admins";
const path = require('path');

const AdminSchema = mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    employeeids : {
        type : Array,
        ref : 'Employee'
    },
    taskid : {
        type : Array,
        ref : 'Task'
    }
});

const AdminData = mongoose.model('Admin',AdminSchema);
module.exports = AdminData;