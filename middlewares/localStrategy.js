const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const path = require('path');
const User = require(path.join(__dirname, '..', 'models', 'user'));

module.exports = () =>{
    passport.use(new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback: false,
        }, async(email, password, done) =>{
            try{
                const exUser = await User.findOne({
                    where : { email }
                });

                if(exUser){
                    //check password
                    const result = await bcrypt.compare(password, exUser.password); 
                    
                    console.log(`localStrategy: exUser = email: ${exUser.email},  id: ${exUser.id}`);

                    if(result){ // result는 이제 true 또는 false 불리언 값입니다.
                        done(null, exUser); 
                    }
                    else{
                        done(null, false, {message: '비밀번호가 일치하지 않습니다.'});
                    }
                }
                else{
                    done(null, false, {message: '가입되지 않은 회원 입니다.'});   
                }
            }catch(err){
                console.log(err);
                done(err);
            }
        }
    ));
};

