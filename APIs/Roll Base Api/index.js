const express = require('express');
const port = 9001;

const app = express();
const mongoose = require('./config/mongoose');
const register = require('./models/ADMIN/register');

const passport = require('passport');

const passportjwt = require('./config/passport_jwt_strategy')

const session = require('express-session');

app.use(express.urlencoded());

app.use(session({
    name : "JWTSESSION",
    secret : "batch",
    resave : true,
    saveUninitialized: false,
    cookie : {
        maxAge : 1000*60*100
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.use("/admin", require('./routes/API/V1/ADMIN/admin'));
app.use("/",require('./routes/API/V1/USER/user'))

app.listen(port, (err) => {
    if(err)console.log("Something is Worng");
    console.log("Server is running :",port);
})