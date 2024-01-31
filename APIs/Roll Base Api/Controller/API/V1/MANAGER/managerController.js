const manager = require('../../../../models/MANAGER/ManagerRegister');
const Admin = require('../../../../models/ADMIN/register');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwtData = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const user = require('../../../../models/USER/user');


module.exports.addmanager = async (req, res) => {
    try {
        let checkemail = await manager.findOne({ email: req.body.email });
        if (checkemail) {
            return res.status(200).json({msg:'Email alrady  Ragisted....',status:1});
        }  
        else {
            if (req.body.password == req.body.confirm_password) {
                var imgpath = '';
                if(req.file){
                    imgpath = manager.imagePath+"/"+req.file.filename;
                }
                req.body.image = imgpath;
                req.body.password = await bcrypt.hash(req.body.password,10);
                req.body.adminids = req.user.id;
                let data = await manager.create(req.body);
                if (data) {
                    const transporter = nodemailer.createTransport({
                        host: "smtp.gmail.com",
                        port: 465,
                        secure: true,
                        auth: {
                          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                          user: "paghadalavadhpaghadalavadh607@gmail.com",
                          pass: "schnetkebitevjhn",
                        },
                    });
                    const info = await transporter.sendMail({
                        from: 'paghadalavadhpaghadalavadh607@gmail.com', // sender address
                        to: req.body.email, // list of receivers
                        subject: "Contact", // Subject line
                        text: "Hello MAnager", // plain text body
                        html: `<p>Email : ${req.body.email}</p><p>Password : ${req.body.password}</p>`, // html body
                      });  

                      let record = await Admin.findById(req.user.id);
                      record.managerids.push(data.id);
                      await Admin.findByIdAndUpdate(req.user.id,record);
                      return res.status(200).json({ mes: 'Record is Insert', status: 1 });
                }
                else {
                    return res.status(200).json({msg:'Data not Inserted Succ....',status:0});
                }
                    
            }
            else {
                return res.status(200).json({msg:'Password not match',status:1});
            }
        }
    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({msg:'Somthing Wrong',status:0});  
    }
}

module.exports.login = async(req,res)=>{
    try{
        let check = await manager.findOne({email:req.body.email});
        if(check){
            if(await bcrypt.compare(req.body.password,check.password)){
                let token = await jwtData.sign({data : check}, 'batch_manager',{expiresIn: '1h'});
                return res.status(200).json({mes:"Login Successfuly",status : 1 , record:token});
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
        console.log('Somthing Wrong');
        return res.status(400).json({msg:'Somthing Wrong',status:0});
    }
}

module.exports.profile = async(req,res)=>{
    try{
        let managerData = await manager.findById(req.user.id).populate('adminids').exec();
        if(managerData){
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: managerData });
        }
        else{
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }
    }
    catch(err){
        console.log('Somthing Wrong');
        return res.status(400).json({msg:'Somthing Wrong',status:0});
    }
}

module.exports.updatemanagerprofile = async(req,res)=>{
    try{
        if(req.file){
            let oldimgData = await manager.findById(req.params.id);
            if(oldimgData.image){
                let FullPath = path.join(__dirname,"../../../../",oldimgData.image);
                await fs.unlinkSync(FullPath);
            }
            var imagePath = '';
            imagePath = manager.imagePath+"/"+req.file.filename;
            req.body.image = imagePath;
        }
        else{
            let olddata = await manager.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }
        let updateData = await manager.findByIdAndUpdate(req.params.id, req.body);
        if (updateData) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: updateData });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }
    }
    catch(err){
        console.log('Somthing Wrong');
        return res.status(400).json({msg:'Somthing Wrong',status:0});
    }
}

module.exports.viewAllUser = async(req,res)=>{
    try{
        let userData = await user.find({});
        if(userData){
            return res.status(200).json({ msg: 'Record is here...', status: 1,res:userData });
        }
        else{
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }
    }
    catch(err){
        console.log('Somthing Wrong');
        return res.status(400).json({msg:'Somthing Wrong',status:0});
    }
}