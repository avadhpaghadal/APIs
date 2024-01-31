const task = require('../../../../Models/Admin/task');
const employee = require('../../../../Models/Employee/employee');
const admin = require('../../../../Models/Admin/register');

module.exports.AddTask = async(req,res) =>{
    // let empData = req.body.id
    // let data = await task.find(empData)
    // console.log(data);
    try{
        // let empData = req.body.empids; 
        req.body.adminid = req.user.id;
        req.body.status = "pending";
        req.body.date = new Date().toLocaleString();
        let data =await task.create(req.body);
        
        if(data){
            // let reg1 = await employee.findById(empData);
            // reg1.taskids.push(data.id);
            // console.log(data.id);
            // await employee.findByIdAndUpdate(empData,reg1);

             let reg = await admin.findById(req.user.id);
             reg.taskid.push(data.id);
             await admin.findByIdAndUpdate(req.user.id,reg);


            return res.status(200).json({msg:'Data Inserted Succ....',status:1,rec:data});
        }
        else{
            return res.status(200).json({msg:'Data not Inserted Succ....',status:0});
        }
}
catch(err){
    console.log('Somthing Wrong');
    return res.status(400).json({msg:'Somthing Wrong',status:0});
}
}