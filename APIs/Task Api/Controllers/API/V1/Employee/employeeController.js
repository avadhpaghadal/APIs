const employee = require('../../../../Models/Employee/employee');
const Admin = require('../../../../Models/Admin/register');
const task = require('../../../../Models/Admin/task');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwtData = require('jsonwebtoken');


module.exports.addEmployee = async (req, res) => {
    try {
        let checkemail = await employee.findOne({ email: req.body.email });
        if (checkemail) {
            return res.status(200).json({msg:'Email alrady  Ragisted....',status:1});
        }  
        else {
            if (req.body.password == req.body.confirm_password) {
                req.body.password = await bcrypt.hash(req.body.password,10);
                req.body.adminids = req.user.id;
                let data = await employee.create(req.body);
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
                      record.employeeids.push(data.id);
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
        let check = await employee.findOne({email:req.body.email});
        if(check){
            if(await bcrypt.compare(req.body.password,check.password)){
                let token = await jwtData.sign({data : check}, 'batch_employee',{expiresIn: '1h'});
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

module.exports.profile = async (req, res) => {

    try {
        let empdatas = await employee.findById(req.user.id).populate('adminids').exec();
        if (empdatas) {
            return res.status(200).json({ msg: 'Data Found Succ....', status: 1, rec: empdatas});
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

module.exports.EditProfile = async (req, res) => {

    try {

        let empupdated = await employee.findByIdAndUpdate(req.params.id, req.body);

        if (empupdated) {
            return res.status(200).json({ msg: 'Data Updated Succ....', status: 1, rec: empupdated });
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


module.exports.viewAllTask = async (req, res) => {

    try {
        let taskdata = await task.find({empids : req.user.id}).populate('adminid').exec();
       
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

module.exports.AllTask = async (req, res) => {

    try {
        let taskdata = await task.find({empids : req.user.id});
       
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
module.exports.ActiveTask = async (req, res) => {

    try{
        if(req.params.id)
        {
            let taskdata = await task.findByIdAndUpdate(req.params.id,{status : "Active"});

            if(taskdata)
            {
                return res.status(200).json({ msg: 'Task Activeted Succ....', status: 1, rec: taskdata });
            }
            else{
                return res.status(200).json({ msg: 'No Record found', status: 0 });
            }
        }
        else
        {
            console.log("Params is Not Found!!!");
        }
    }
    catch(err)
    {
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}

module.exports.ComplateTask = async (req, res) => {

    try{
        if(req.params.id)
        {
            let taskdata = await task.findByIdAndUpdate(req.params.id,{status : "Completed"});

            if(taskdata)
            {
                return res.status(200).json({ msg: 'Task Completed Succ....', status: 1, rec: taskdata });
            }
            else{
                return res.status(200).json({ msg: 'No Record found', status: 0 });
            }
        }
        else
        {
            console.log("Params is Not Found!!!");
        }
    }
    catch(err)
    {
        return res.status(400).json({ msg: 'Somthing Wrong', status: 0 });
    }
}