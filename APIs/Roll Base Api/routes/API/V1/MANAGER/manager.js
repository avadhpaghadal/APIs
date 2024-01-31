const express = require('express');

const routes = express.Router();
const passport = require('passport');
const managerController = require('../../../../Controller/API/V1/MANAGER/managerController');
const manager = require('../../../../models/MANAGER/ManagerRegister');
const register = require('../../../../models/ADMIN/register');

routes.post('/addmanager',passport.authenticate('jwt',{failureRedirect:"/admin/manager/failLogin"}),manager.uploadImage,managerController.addmanager);

routes.get("/failLogin", async (req, res) => {
    return res.status(400).json({ mes: 'Fail Login', status: 0 });
})
routes.post('/login',managerController.login);
routes.get('/profile',passport.authenticate('manager',{failureRedirect : "/admin/manager/failLogin"}),managerController.profile);
routes.put('/updatemanagerprofile/:id',passport.authenticate('manager',{failureRedirect : "/admin/manager/failLogin"}),manager.uploadImage,managerController.updatemanagerprofile);

routes.get('/viewAllUser',passport.authenticate('manager',{failureRedirect : "/admin/manager/failLogin"}),managerController.viewAllUser)

module.exports = routes;