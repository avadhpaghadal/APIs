const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;

const jwtExtract = require('passport-jwt').ExtractJwt;

const Register = require('../models/ADMIN/register');
const manager = require('../models/MANAGER/ManagerRegister');
const user = require('../models/USER/user');

var opts = {
    jwtFromRequest: jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'batch',
}

var opts1 = {
    jwtFromRequest : jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'batch_manager'
}

var opts2 = {
    jwtFromRequest : jwtExtract.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'batch_user'
}

passport.use(new jwtStrategy(opts, async function(record, done){
    let checkAdmin = await Register.findById(record.data._id);
    if (checkAdmin) {
        return done(null, checkAdmin);
    }
    else {
        return done(null, false);
    }
}))

passport.use('manager' ,new jwtStrategy(opts1, async function(record, done){
    let checkManager = await manager.findById(record.data._id);
    if (checkManager) {
        return done(null, checkManager);
    }
    else {
        return done(null, false);
    }
}))

passport.use('user' ,new jwtStrategy(opts2, async function(record, done){
    let checkUser = await user.findById(record.data._id);
    if (checkUser) {
        return done(null, checkUser);
    }
    else {
        return done(null, false);
    }
}))

passport.serializeUser(function (user, done) {
    return done(null, user.id);
})

passport.deserializeUser(async function (id, done) {
    let recheck = await Register.findById(id);
    if (recheck) {
        return done(null, recheck);
    }
    else {
        return done(null, false);        
    }
})