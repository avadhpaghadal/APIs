const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const jwtExtract = require('passport-jwt').ExtractJwt;

const Admin = require('../Models/Admin/register');
const employee = require('../Models/Employee/employee');

var opts = {
    jwtFromRequest : jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'batch'
}
var opts1 = {
    jwtFromRequest : jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'batch_employee'
}

passport.use(new jwtStrategy(opts, async function(record, done){
    let checkAdmin = await Admin.findById(record.data._id);
    if (checkAdmin) {
        return done(null, checkAdmin);
    }
    else {
        return done(null, false);
    }
}))
passport.use('employee',new jwtStrategy(opts1, async function(record, done){
    let checkemp = await employee.findById(record.data._id);
    if (checkemp) {
        return done(null, checkemp);
    }
    else {
        return done(null, false);
    }
}))

passport.serializeUser(function (user, done) {
    return done(null, user.id);
})

passport.deserializeUser(async function (id, done) {
    let recheck = await Admin.findById(id);
    if (recheck) {
        return done(null, recheck);
    }
    else {
        return done(null, false);        
    }
})