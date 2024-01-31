const express = require('express');
const port = 9000;

const app = express();

const mongoose = require('./config/mongoose');
const admin = require('./Models/Admin/register');

const passportjwt = require('./config/passport_jwt_strategy');
const session = require('express-session');
const passport = require('passport');
app.use(express.urlencoded());

app.use(session({
    name : "JWTSESSION",
    secret : "batch",
    resave : true,
    saveUninitialized: false,
    cookie : {
        maxAge : 1000*60*100
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/admin", require('./routes/API/V1/Admin/admin'));

app.listen(port,(err)=>{
    if(err)console.log("Something is worng");
    console.log("Server is running :",port);
})