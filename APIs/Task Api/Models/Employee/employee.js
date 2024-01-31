const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    adminids : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Admin'
    },
    taskids : {
        type : Array,
        ref : 'Task'
    }
});

const EmployeeData = mongoose.model('Employee',EmployeeSchema);
module.exports = EmployeeData;