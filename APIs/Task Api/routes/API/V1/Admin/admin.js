const express = require('express');
const routes = express.Router();
const passport = require('passport');

const admin = require('../../../../Models/Admin/register');
const task = require('../../../../Models/Admin/task');
const adminController = require('../../../../Controllers/API/V1/Admin/adminController');
const taskController = require('../../../../Controllers/API/V1/Admin/TaskController');

routes.post('/register',adminController.register);
routes.post('/login',adminController.login);

routes.get('/viewAllAdmin',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),adminController.viewAllAdmin);
routes.get ('/profile',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),adminController.profile);
routes.put('/Editrpofile/:id',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),adminController.Editrpofile);
routes.get("/viewAllEmployee",passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),adminController.viewAllEmployee);
routes.post("/AddTask",passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),taskController.AddTask);
routes.get('/viewmyTask_given',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),adminController.viewmyTask_given);
routes.get('/viewAllTask',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),adminController.viewAllTask);

routes.get("/failLogin", async (req, res) => {
    return res.status(400).json({ mes: 'Fail Login', status: 0 });
})

routes.use('/employee',require('../Employee/employee'));

module.exports = routes;