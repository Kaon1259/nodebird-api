const path = require('path');
const passport = require('passport');
const User = require(path.join(__dirname, '..', 'models', 'user'));
const localStrategy = require(path.join(__dirname, '..', 'middlewares', 'localStrategy'));

module.exports = () =>{

     //strategy 등록,...
    localStrategy();

    passport.serializeUser((user, done)=>{
        console.log(`serializeUser : ${user.id}`);
        done(null, user.id);
    });

    passport.deserializeUser((id, done) =>{
        console.log(`deserializeUser : ${id}`);
        User.findOne({
            where: {id}
        })
        .then(user => done(null, user))
        .catch(err => done(err))
    });
};