const Admin = require('../../../../Models/Admin/register');
const bcrypt = require('bcrypt');
const jwtData = require('jsonwebtoken');
const EmployeeData = require('../../../../Models/Employee/employee');
const task = require('../../../../Models/Admin/task');
module.exports.register = async(req,res)=>{
    try{
        let checkEmail = await Admin.findOne({email : req.body.email});
        if(checkEmail){
            return res.status(200).json({ mes: 'Email is Already Exist', status: 0 });
        }
        else{
            let cpass = req.body.confirm_password;
            if(cpass == req.body.password){
                req.body.password = await bcrypt.hash(req.body.password,10);
                let ReData = await Admin.create(req.body);
                if(ReData){
                    return res.status(200).json({ mes: 'Record is Insert..', status: 1 });
                }
                else{
                    return res.status(200).json({ mes: 'Record is Not Insert', status: 0 });
                }
            }
            else{
                return res.status(200).json({ mes: 'Confirm password is not match', status: 0 });
            }
        }
    }
    catch(err){
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}

module.exports.login =async(req,res)=>{
    try{
        let checkEmail = await Admin.findOne({email:req.body.email});
        if(checkEmail){
            if(await bcrypt.compare(req.body.password,checkEmail.password)){
                let Token = await jwtData.sign({data : checkEmail},'batch',{expiresIn : '1h'});
                return res.status(200).json({ mes: 'Login is success', status: 1 , record : Token });
            }
            else{
                return res.status(200).json({ mes: 'password is not match', status: 0 });
            }
        }
        else{
            return res.status(200).json({ mes: 'Invalid Email', status: 0 });
        }
    }
    catch(err){
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}

module.exports.viewAllAdmin = async(req,res)=>{
    try {
        let adminData = await Admin.find({});
        if (adminData) {
            return res.status(200).json({ mes: 'Record id here', status: 1 , record : adminData});
        }
        else {
            return res.status(200).json({ mes: 'Record not found', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}

module.exports.profile = async (req, res) => {
    try {
        let profileData = await Admin.findById(req.user.id).populate('employeeids').exec();
        if (profileData)
        {
            return res.status(200).json({ mes: 'Profile Record id here', status: 1 , profile : profileData});
        }
        else {
            return res.status(200).json({ mes: 'Record not found', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}

module.exports.Editrpofile = async (req, res) => {
    try {
        let updateProfile = await Admin.findByIdAndUpdate(req.params.id,req.body);
        if(updateProfile)
        {
            return res.status(200).json({ mes: 'Profile Record Updated', status: 1});
        }
        else {
            return res.status(200).json({ mes: 'Record not update', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}

module.exports.viewAllEmployee = async(req,res)=>{
    try{
        let managerData = await EmployeeData.find({});
        if(managerData){
            return res.status(200).json({ mes: 'Record is here..', status: 1, rec:managerData });
        }
        else{
            return res.status(200).json({ mes: 'Record not found', status: 0 });   
        }
    }
    catch(err){
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}

module.exports.viewmyTask_given = async (req, res) => {

    try {
        let taskdata = await task.find({adminid : req.user.id}).populate('empids').exec();
       
        if (taskdata) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: taskdata });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}

module.exports.viewAllTask = async (req, res) => {

    try {
        let taskdata = await task.find({}).populate('empids').exec();
       
        if (taskdata) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: taskdata });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}