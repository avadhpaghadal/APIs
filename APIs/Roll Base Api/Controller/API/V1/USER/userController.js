const express = require('express');
const user = require('../../../../models/USER/user');
const bcrypt = require('bcrypt');
const path = require('path');
const nodemailer = require('nodemailer');
const jwtData = require('jsonwebtoken');
const fs = require('fs');

module.exports.add_user = async(req,res)=>{
    try{
        let check = await user.findOne({email:req.body.email});
        if(check){
            return res.status(200).json({ mes: 'Email is Already Exist', status: 0 });
        }
        else{
            let cpss = req.body.confirm_password;
            if(cpss == req.body.password){
                var imagePath = ''
                if(req.file){
                    imagePath = user.imagePath+"/"+req.file.filename;
                }
                req.body.image = imagePath;
                req.body.password = await bcrypt.hash(req.body.password,10);
                let userRec = await user.create(req.body);
                if(userRec){
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
                    return res.status(200).json({ mes: 'Record is insert..', status: 1 });
                }
                else{
                    return res.status(200).json({ mes: 'Record is not insert!!..', status: 0});
                }
            }
            else{
                return res.status(200).json({ mes: 'Confirm password is not match', status: 0 });
            }
        }
    }
    catch(err){
        return res.status(400).json({msg:'Somthing Wrong',status:0});
    }
}


module.exports.login = async(req,res)=>{
    try{
        let check = await user.findOne({email:req.body.email});
        if(check){
            if(await bcrypt.compare(req.body.password,check.password)){
                let token = await jwtData.sign({data :check},'batch_user',{expiresIn : '1h'});
                return res.status(200).json({msg:'Login success...',status:1, rec :token});
            }
            else{
                return res.status(200).json({msg:'Password not match',status:0});
            }
        }
        else{
            return res.status(200).json({msg:'Invalid email!!',status:0});
        }
    }   
    catch(err){
        return res.status(400).json({msg:'Somthing Wrong',status:0});
    } 
}


module.exports.profile = async(req,res)=>{
    try{
        let user = await req.user;
        if(user){
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: user });
        }
        else {
            return res.status(200).json({ msg: 'No Record found', status: 0 });
        }
    }
    catch(err){
        return res.status(400).json({msg:'Somthing Wrong',status:0});
    } 
}

module.exports.Editprofile = async (req, res) => {
  
    try {
        if (req.file) {
            let oldimgData = await user.findById(req.params.id);

            if (oldimgData.image) {
                let FullPath = path.join(__dirname, "../../../..", oldimgData.image);
                await fs.unlinkSync(FullPath);
            }
            var imagePath = '';
            imagePath = user.imagePath + "/" + req.file.filename;
            req.body.image = imagePath;
        }
        else {
            let olddata = await user.findById(req.params.id);
            var imgpath = '';
            if (olddata) {
                imgpath = olddata.image;
            }
            req.body.image = imgpath;
        }

        let userupdated = await user.findByIdAndUpdate(req.params.id, req.body);

        if (userupdated) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: userupdated });
        }
        else {
            return res.status(400).json({ msg: 'not Updated Succ..', status: 0 });
        }

    }
    catch (err) {
        console.log('Somthing Wrong');
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}