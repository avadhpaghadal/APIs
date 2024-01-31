const Admin = require('../../../../models/ADMIN/register');
const bcrypt = require('bcrypt');
const jwtDAta = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const manager = require('../../../../models/MANAGER/ManagerRegister');
const user = require('../../../../models/USER/user');


module.exports.register = async (req, res) => {
    try {
        let checkEmail = await Admin.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(200).json({ mes: 'Email is Already Exist', status: 0 });
        }
        else {
            let cpass = req.body.confirm_pass;
            if (cpass == req.body.password) {
                var imagePath = '';
                if (req.file) {
                    imagePath = Admin.imagePath+"/"+req.file.filename
                }
                req.body.image = imagePath;
                req.body.password = await bcrypt.hash(req.body.password, 10);
                let ReData = await Admin.create(req.body);
                if (ReData) {
                    return res.status(200).json({ mes: 'Record is Insert', status: 1 });
                }
                else {
                    return res.status(200).json({ mes: 'Record is Not Insert', status: 0 });
                }   
            }
            else {
                return res.status(200).json({ mes: 'Confirm password is not match', status: 0 });
            }
            
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}


module.exports.login = async (req, res) => {
    try {
        let checkEmail = await Admin.findOne({ email: req.body.email });
        if (checkEmail) {
            if (await bcrypt.compare(req.body.password, checkEmail.password)) {
                let token = await jwtDAta.sign({ data: checkEmail }, 'batch', { expiresIn: '1h' });
                return res.status(200).json({ mes: 'Login is success', status: 1 , record : token });
            }
            else {
                return res.status(200).json({ mes: 'password is not match', status: 0 });
            }
        }
        else {
            return res.status(200).json({ mes: 'Invalid Email', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}



module.exports.viewAllAdmin = async (req, res) => {
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
        let profileData = await Admin.findById(req.user.id).populate('managerids').exec();
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


module.exports.updateProfile = async (req, res) => {
    try {
        if (req.file) {
            let oldData = await Admin.findById(req.params.id);
            
                if(oldData.image)
            {
                    let FullPath = path.join(__dirname, "../../../../", oldData.image);
                    console.log(FullPath)
                    await fs.unlinkSync(FullPath);
            }
             var imageP = '';
             imageP = Admin.imagePath + "/" + req.file.filename;
            req.body.image = imageP;
            console.log(imageP);
        }
        else {
            let oldAdmin = await Admin.findById(req.params.id);
            var imagePath = '';
            if(oldAdmin) {
                imagePath = oldAdmin.image;
            }
            req.body.image = imagePath;
           
        }
        let updateProfile = await Admin.findByIdAndUpdate(req.params.id,req.body);
        if(updateProfile)
        {

            return res.status(200).json({ mes: 'Profile Record Updated', status: 1,rec:req.user});
        }
        else {
            return res.status(200).json({ mes: 'Record not update', status: 0 });
        }
    }
    catch (err) {
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}


module.exports.viewAllmanager = async(req,res)=>{
    try{
        let managerData = await manager.find({});
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

module.exports.viewAllUser = async(req,res)=>{
    try{
        let UserData = await user.find({});
        if(UserData){
            return res.status(200).json({ mes: 'Record is here..', status: 1, rec:UserData });
        }
        else{
            return res.status(200).json({ mes: 'Record not found', status: 0 });   
        }
    }
    catch(err){
        return res.status(400).json({ mes: 'Record is Not Found', status: 0 });
    }
}
