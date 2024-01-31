const express = require('express');
const routes = express.Router();
const user = require('../../../../models/USER/user');
const userController = require('../../../../Controller/API/V1/USER/userController');
const passport = require('passport');


routes.post('/add_user',user.uploadImage,userController.add_user);
routes.post('/login',userController.login);


routes.get('/profile',passport.authenticate('user',{failureRedirect:"/failLogin"}),userController.profile);
routes.get("/failLogin" ,async (req,res) =>{
    return res.status(400).json({msg:'invalid Login',status:0});
});

routes.put('/Editprofile/:id',passport.authenticate('user',{failureRedirect:"/failLogin"}),user.uploadImage,userController.Editprofile);

module.exports = routes;