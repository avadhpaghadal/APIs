const express = require('express')

const routes = express.Router();

const register = require('../../../../models/ADMIN/register');
const AdminController = require('../../../../Controller/API/V1/ADMIN/adminController');

const passport = require('passport');

routes.post("/register" ,register.uploadImage, AdminController.register)
routes.post("/login",AdminController.login);


routes.get('/viewAllAdmin',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),AdminController.viewAllAdmin)
routes.get('/profile',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),AdminController.profile)
routes.put('/updateProfile/:id',passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),register.uploadImage,AdminController.updateProfile)


routes.get("/failLogin", async (req, res) => {
    return res.status(400).json({ mes: 'Fail Login', status: 0 });
})

routes.get("/viewAllmanager",passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),AdminController.viewAllmanager);
routes.get("/viewAllUser",passport.authenticate('jwt',{failureRedirect:"/admin/failLogin"}),AdminController.viewAllUser)

routes.use('/manager', require('../MANAGER/manager'));

module.exports = routes;