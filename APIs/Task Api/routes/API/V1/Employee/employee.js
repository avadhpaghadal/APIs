const express = require('express')
const routes = express.Router();
const passport = require('passport');
const employeeController = require('../../../../Controllers/API/V1/Employee/employeeController');
const employee = require('../../../../Models/Employee/employee');

routes.post('/addEmployee',passport.authenticate('jwt',{failureRedirect:"/admin/employee/failLogin"}),employeeController.addEmployee);
routes.get("/failLogin", async (req, res) => {
    return res.status(400).json({ mes: 'Fail Login', status: 0 });
})
routes.post('/login',employeeController.login);

routes.get('/profile',passport.authenticate('employee',{failureRedirect:"/admin/employee/failLogin"}),employeeController.profile);
routes.put('/EditProfile/:id',passport.authenticate('employee',{failureRedirect:"/admin/employee/failLogin"}),employeeController.EditProfile);
routes.get('/viewAllTask',passport.authenticate('employee',{failureRedirect:"/admin/employee/failLogin"}),employeeController.viewAllTask);
routes.get('/AllTask',passport.authenticate('employee',{failureRedirect:"/admin/employee/failLogin"}),employeeController.AllTask);
routes.get('/ActiveTask/:id',passport.authenticate('employee',{failureRedirect:"/admin/employee/failLogin"}),employeeController.ActiveTask);
routes.get('/ComplateTask/:id',passport.authenticate('employee',{failureRedirect:"/admin/employee/failLogin"}),employeeController.ComplateTask);

module.exports = routes;